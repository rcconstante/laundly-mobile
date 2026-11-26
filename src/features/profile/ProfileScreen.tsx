import UserCircleIcon from '@hugeicons/core-free-icons/UserCircleIcon';
import InformationCircleIcon from '@hugeicons/core-free-icons/InformationCircleIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, StyleSheet, Switch, Text, View } from 'react-native';
import { BrandLogo } from '../../shared/brand/BrandLogo';
import { brandName, websiteUrl } from '../../shared/brand/brand';
import { LegalLinks } from '../../shared/legal/LegalLinks';
import { Action, Copy, ErrorText, Field, Heading, ItemRow, Panel } from '../../shared/ui/WorkspaceUI';
import { colors } from '../../theme';
import { isValidEmail } from '../auth/validation';
import { roles, type Role } from '../workspace/roles';

type Profile = { name: string; email: string; notifications: boolean };

export function ProfileScreen({ role }: { role: Role }) {
  const key = 'laundly.profile.' + role;
  const [profile, setProfile] = useState<Profile>({ name: roles[role].label + ' demo', email: '', notifications: false });
  const [draft, setDraft] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [about, setAbout] = useState(false);
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

  return <>
    <Heading title="Profile" detail="Account details, preferences, and app information." />
    <ErrorText message={error} />
    <Panel title="Account">
      <ItemRow title={profile.name} detail={profile.email || roles[role].label + ' workspace'}
        icon={UserCircleIcon} />
      {draft ? <>
        <Field label="Display name" value={draft.name} onChangeText={(name) => setDraft({ ...draft, name })} maxLength={80} />
        <Field label="Profile email" value={draft.email} onChangeText={(email) => setDraft({ ...draft, email })}
          autoCapitalize="none" keyboardType="email-address" maxLength={150} />
        <Action label="Save profile" disabled={busy} onPress={saveDetails} />
        <Action label="Cancel" secondary onPress={() => { setDraft(null); setError(''); }} />
      </> : <Action label="Edit profile" secondary disabled={!ready} onPress={() => setDraft(profile)} />}
    </Panel>
    <Panel title="Preferences">
      <ItemRow title="Language" value="English" />
      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text style={styles.label}>Laundry updates</Text>
          <Copy>Stores your notification preference on this device.</Copy>
        </View>
        <Switch accessibilityLabel="Laundry updates" value={profile.notifications} disabled={busy || !ready || !!draft}
          onValueChange={(notifications) => { void save({ ...profile, notifications }); }} />
      </View>
    </Panel>
    <Panel title="About">
      <ItemRow title={"About " + brandName} detail="App information and policies" icon={InformationCircleIcon}
        value={about ? 'Close' : 'Open'} action={() => setAbout(!about)} />
      {about && <View style={styles.about}>
        <BrandLogo markSize={55} />
        <Copy>{brandName} {Constants.expoConfig?.version ?? '1.0.0'}</Copy>
        <Copy>Tools for laundry shops, customers, and delivery riders.</Copy>
        <Action label={"Visit " + brandName + " website"} secondary onPress={() => {
          Linking.openURL(websiteUrl).catch(() => setError('Could not open the ' + brandName + ' website.'));
        }} />
        <LegalLinks includeCookies />
      </View>}
    </Panel>
    <Panel title="Session">
      {signOut ? <>
        <Copy>Return to the welcome screen? Your local settings and branch records will remain available.</Copy>
        <Action label="Confirm sign out" onPress={() => router.dismissTo('/')} />
        <Action label="Cancel sign out" secondary onPress={() => setSignOut(false)} />
      </> : <Action label="Sign out" secondary onPress={() => setSignOut(true)} />}
    </Panel>
  </>;
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 48 },
  switchText: { flex: 1, gap: 3 },
  label: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: colors.ink },
  about: { gap: 8, paddingVertical: 8 },
});
