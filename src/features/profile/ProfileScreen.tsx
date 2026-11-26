import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { brandName, websiteUrl } from '../../shared/brand/brand';
import { LegalLinks } from '../../shared/legal/LegalLinks';
import { Action, Copy, ErrorText, Field, Heading, Panel } from '../../shared/ui/WorkspaceUI';
import { colors } from '../../theme';
import { isValidEmail } from '../auth/validation';
import { roleOptions, roles, workspaceHref, type Role } from '../workspace/roles';
import { ProfileArtwork, ProfileSetting } from './ProfileSetting';

type Profile = { name: string; email: string; notifications: boolean };

const version = Constants.expoConfig?.version ?? '1.0.0';

export function ProfileScreen({ role }: { role: Role }) {
  const key = 'laundly.profile.' + role;
  const [profile, setProfile] = useState<Profile>({ name: roles[role].label + ' demo', email: '', notifications: false });
  const [draft, setDraft] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
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

  return (
    <>
      <Heading title="Profile" />
      <View style={styles.profileHeader}>
        <Pressable accessibilityRole="button" accessibilityLabel="Open profile editor"
          disabled={!ready || busy} onPress={() => setDraft(profile)} style={styles.avatar}>
          <ProfileArtwork name="account" size={50} />
        </Pressable>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile.name}</Text>
          <Copy>{profile.email || roles[role].label + ' workspace'}</Copy>
          <Pressable accessibilityRole="button" disabled={!ready || busy} onPress={() => setDraft(profile)} style={styles.edit}>
            <Text style={styles.link}>Edit profile</Text>
          </Pressable>
        </View>
        <Text numberOfLines={1} style={styles.badge}>{roles[role].label}</Text>
      </View>
      <ErrorText message={error} />
      {draft && (
        <Panel title="Edit profile details">
          <Field label="Display name" value={draft.name} onChangeText={(name) => setDraft({ ...draft, name })} maxLength={80} />
          <Field label="Profile email" value={draft.email} onChangeText={(email) => setDraft({ ...draft, email })}
            autoCapitalize="none" keyboardType="email-address" maxLength={150} />
          <Action label="Save profile" disabled={busy} onPress={saveDetails} />
          <Action label="Cancel" secondary disabled={busy} onPress={() => { setDraft(null); setError(''); }} />
        </Panel>
      )}

      <Panel title="Switch profile">
        <View accessibilityRole="radiogroup" accessibilityLabel="Switch profile" style={styles.roles}>
          {roleOptions.map((choice) => (
            <Pressable key={choice} accessibilityRole="radio" accessibilityLabel={roles[choice].label}
              aria-checked={role === choice} disabled={busy} style={[styles.role, role === choice && styles.selected]}
              onPress={() => { if (choice !== role) router.replace(workspaceHref(choice, 'profile')); }}>
              <Text style={[styles.roleText, role === choice && styles.link]}>{roles[choice].label}</Text>
            </Pressable>
          ))}
        </View>
      </Panel>

      <ProfileSetting icon="preferences" title="Laundry updates" detail="Notification preference saved on this device"
        control={<Switch accessibilityLabel="Laundry updates" value={profile.notifications} disabled={busy || !ready || !!draft}
          onValueChange={(notifications) => { void save({ ...profile, notifications }); }} />} />
      <ProfileSetting icon="language" title="Language" detail="App display language"
        control={<Text style={styles.value}>English</Text>} />
      <ProfileSetting icon="about" title={'About ' + brandName} detail={'Version ' + version + ' · Legal and privacy'}>
        <Pressable accessibilityRole="link" onPress={() => {
          Linking.openURL(websiteUrl).catch(() => setError('Could not open the ' + brandName + ' website.'));
        }} style={styles.website}>
          <Text style={styles.link}>{'Visit ' + brandName + ' website'}</Text>
        </Pressable>
        <LegalLinks includeCookies />
      </ProfileSetting>
      {signOut ? (
        <Panel title="Sign out">
          <Copy>Return to the welcome screen? Your local settings and branch records will remain available.</Copy>
          <Action label="Confirm sign out" disabled={busy} onPress={() => router.dismissTo('/')} />
          <Action label="Cancel sign out" secondary onPress={() => setSignOut(false)} />
        </Panel>
      ) : <Action label="Sign out" secondary onPress={() => setSignOut(true)} />}
    </>
  );
}

const styles = StyleSheet.create({
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 7 },
  avatar: { width: 66, height: 66, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.white, borderRadius: 20, borderWidth: 1, borderColor: colors.line },
  profileInfo: { flex: 1, minWidth: 0, gap: 3 },
  name: { color: colors.ink, fontFamily: 'Inter_700Bold', fontSize: 19 },
  edit: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  link: { color: colors.blue, fontFamily: 'Inter_700Bold', fontSize: 13 },
  badge: { color: colors.blue, fontFamily: 'Inter_600SemiBold', fontSize: 12, maxWidth: '28%',
    backgroundColor: colors.paleBlue, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, overflow: 'hidden' },
  roles: { flexDirection: 'row', gap: 8 },
  role: { flex: 1, minHeight: 44, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center',
    borderColor: colors.line, borderWidth: 1, borderRadius: 22 },
  selected: { backgroundColor: colors.paleBlue, borderColor: '#B7CBFF' },
  roleText: { color: colors.muted, fontFamily: 'Inter_600SemiBold', fontSize: 13, textAlign: 'center' },
  value: { color: colors.muted, fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  website: { minHeight: 44, justifyContent: 'center', alignItems: 'center' },
});
