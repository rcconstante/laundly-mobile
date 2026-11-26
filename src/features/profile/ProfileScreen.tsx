import UserCircleIcon from '@hugeicons/core-free-icons/UserCircleIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, StyleSheet, Switch, Text, View } from 'react-native';
import { BrandLogo } from '../../shared/brand/BrandLogo';
import { brandName, websiteUrl } from '../../shared/brand/brand';
import { LegalLinks } from '../../shared/legal/LegalLinks';
import type { LegalModalTarget } from '../../shared/legal/LegalWebModal';
import { Action, Copy, ErrorText, Field, Heading, ItemRow, Panel } from '../../shared/ui/WorkspaceUI';
import { colors } from '../../theme';
import { isValidEmail } from '../auth/validation';
import { roles, type Role } from '../workspace/roles';
import { ProfileMenu, type ProfileSection } from './ProfileMenu';
import { ProfileSheet } from './ProfileSheet';

type Profile = { name: string; email: string; notifications: boolean };

const version = Constants.expoConfig?.version ?? '1.0.0';
const labels: Record<ProfileSection, string> = {
  account: 'Account',
  preferences: 'Preferences',
  language: 'Language',
  about: 'About ' + brandName,
};

export function ProfileScreen({ role }: { role: Role }) {
  const key = 'laundly.profile.' + role;
  const roleLabel = roles[role].label + ' workspace';
  const [profile, setProfile] = useState<Profile>({ name: roles[role].label + ' demo', email: '', notifications: false });
  const [draft, setDraft] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [section, setSection] = useState<ProfileSection | null>(null);
  const [legalPage, setLegalPage] = useState<LegalModalTarget | null>(null);
  const [signOut, setSignOut] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key).then((value) => {
      if (!active || !value) return;
      const parsed = JSON.parse(value) as Partial<Profile>;
      if (typeof parsed.name !== 'string' || typeof parsed.email !== 'string' || typeof parsed.notifications !== 'boolean') {
        throw new Error('Invalid profile');
      }
      setProfile({ name: parsed.name, email: parsed.email, notifications: parsed.notifications });
    }).catch(() => { if (active) setError('Could not read the saved profile.'); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [key]);

  async function save(next: Profile) {
    if (busy || !ready) return;
    setBusy(true);
    setError('');
    try {
      await AsyncStorage.setItem(key, JSON.stringify(next));
      setProfile(next);
      setDraft(null);
    } catch {
      setError('Could not save the profile. Try again.');
    } finally {
      setBusy(false);
    }
  }

  function saveDetails() {
    if (!draft) return;
    const name = draft.name.trim();
    const email = draft.email.trim();
    if (!name || (email && !isValidEmail(email))) {
      setError('Enter a name and a valid email address, or leave the email blank.');
      return;
    }
    void save({ ...draft, name, email });
  }

  function close() {
    if (legalPage) {
      setLegalPage(null);
      return;
    }
    setSection(null);
    setDraft(null);
    setSignOut(false);
  }

  return (
    <>
      <Heading title="Profile" />
      {!section && <ErrorText message={error} />}
      <ProfileMenu items={[
        { section: 'account', label: labels.account, detail: profile.name + ' · ' + (profile.email || roleLabel) },
        { section: 'preferences', label: labels.preferences, detail: 'Laundry updates and notifications' },
        { section: 'language', label: labels.language, detail: 'English' },
        { section: 'about', label: labels.about, detail: 'Version ' + version + ' · Legal and privacy' },
      ]} onSelect={setSection} />

      {section && <ProfileSheet title={labels[section]} legalPage={legalPage} onClose={close}>
        <ErrorText message={error} />
        {section === 'account' && <>
          <Panel title="Local profile">
            <ItemRow title={profile.name} detail={profile.email || roleLabel} icon={UserCircleIcon} />
            {draft ? <>
              <Field label="Display name" value={draft.name} onChangeText={(name) => setDraft({ ...draft, name })} maxLength={80} />
              <Field label="Profile email" value={draft.email} onChangeText={(email) => setDraft({ ...draft, email })}
                autoCapitalize="none" keyboardType="email-address" maxLength={150} />
              <Action label="Save profile" disabled={busy} onPress={saveDetails} />
              <Action label="Cancel" secondary onPress={() => { setDraft(null); setError(''); }} />
            </> : <Action label="Edit profile" secondary disabled={!ready} onPress={() => setDraft(profile)} />}
          </Panel>
          <Panel title="Session">
            {signOut ? <>
              <Copy>Return to the welcome screen? Your local settings and branch records will remain available.</Copy>
              <Action label="Confirm sign out" onPress={() => { close(); router.dismissTo('/'); }} />
              <Action label="Cancel sign out" secondary onPress={() => setSignOut(false)} />
            </> : <Action label="Sign out" secondary onPress={() => setSignOut(true)} />}
          </Panel>
        </>}
        {section === 'preferences' && <Panel title="Notifications">
          <View style={styles.switchRow}>
            <View style={styles.switchText}>
              <Text style={styles.label}>Laundry updates</Text>
              <Copy>Stores your notification preference on this device.</Copy>
            </View>
            <Switch accessibilityLabel="Laundry updates" value={profile.notifications} disabled={busy || !ready}
              onValueChange={(notifications) => { void save({ ...profile, notifications }); }} />
          </View>
        </Panel>}
        {section === 'language' && <Panel title="App display language">
          <ItemRow title="English" value="Current" />
        </Panel>}
        {section === 'about' && <Panel title={brandName}>
          <View style={styles.about}>
            <BrandLogo markSize={56} />
            <Copy>Version {version}</Copy>
            <Copy>Tools for laundry shops, customers, and delivery riders.</Copy>
          </View>
          <Action label={'Visit ' + brandName + ' website'} secondary onPress={() => {
            Linking.openURL(websiteUrl).catch(() => setError('Could not open the ' + brandName + ' website.'));
          }} />
          <LegalLinks includeCookies onOpen={setLegalPage} />
        </Panel>}
      </ProfileSheet>}
    </>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 48 },
  switchText: { flex: 1, gap: 3 },
  label: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.ink },
  about: { alignItems: 'center', gap: 8, paddingVertical: 12 },
});
