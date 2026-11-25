import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import ViewIcon from '@hugeicons/core-free-icons/ViewIcon';
import ViewOffIcon from '@hugeicons/core-free-icons/ViewOffIcon';
import { colors } from '../../theme';
import { FieldError, ShakeableField } from './FieldError';
import { styles, type AuthFormProps } from './formStyles';
import { useFormFocus } from './useFormFocus';
import { isStrongPassword, isValidEmail } from './validation';

type SignUpField = 'fullName' | 'email' | 'password' | 'confirmPassword';

export function SignUpForm({ onContinue, scrollTo, rolePicker }: AuthFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formOffsetYRef = useRef(0);
  const signUpForm = useFormFocus<SignUpField>();

  function handleSignUp() {
    const fieldErrors: Partial<Record<SignUpField, string>> = {};
    if (!fullName.trim()) {
      fieldErrors.fullName = 'Please enter your full name.';
    }
    if (!email.trim() || !isValidEmail(email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }
    if (!isStrongPassword(password)) {
      fieldErrors.password = 'Use at least 8 characters with both letters and numbers.';
    }
    if (!confirmPassword) {
      fieldErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      fieldErrors.confirmPassword = 'Passwords do not match.';
    }

    if (signUpForm.reportErrors(fieldErrors, ['fullName', 'email', 'password', 'confirmPassword'], {
      scrollTo,
      containerOffsetY: formOffsetYRef.current,
    })) return;

    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    onContinue();
  }

  return (
    <View style={styles.form} onLayout={(event) => { formOffsetYRef.current = event.nativeEvent.layout.y; }}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Enter your details below to get started with Laundly</Text>
      </View>
      <ShakeableField
        shakeKey={signUpForm.getShakeKey('fullName')}
        onLayout={signUpForm.registerLayout('fullName')}
        style={styles.fieldGroup}
      >
        <View
          style={[
            styles.inputBox,
            signUpForm.errors.fullName ? styles.inputBoxError : null,
          ]}
        >
          <TextInput
            ref={signUpForm.registerInput('fullName')}
            accessibilityLabel="Full name" autoComplete="name"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              signUpForm.clearError('fullName');
            }}
            placeholder="Full name"
            placeholderTextColor={colors.muted}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => signUpForm.focusInput('email')}
            style={styles.input}
          />
        </View>
        <FieldError message={signUpForm.errors.fullName} />
      </ShakeableField>

      <ShakeableField
        shakeKey={signUpForm.getShakeKey('email')}
        onLayout={signUpForm.registerLayout('email')}
        style={styles.fieldGroup}
      >
        <View
          style={[
            styles.inputBox,
            signUpForm.errors.email ? styles.inputBoxError : null,
          ]}
        >
          <TextInput
            ref={signUpForm.registerInput('email')}
            accessibilityLabel="Email address" autoComplete="email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              signUpForm.clearError('email');
            }}
            placeholder="Email address"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => signUpForm.focusInput('password')}
            style={styles.input}
          />
        </View>
        <FieldError message={signUpForm.errors.email} />
      </ShakeableField>

      <ShakeableField
        shakeKey={signUpForm.getShakeKey('password')}
        onLayout={signUpForm.registerLayout('password')}
        style={styles.fieldGroup}
      >
        <View
          style={[
            styles.inputBox,
            signUpForm.errors.password ? styles.inputBoxError : null,
          ]}
        >
          <TextInput
            ref={signUpForm.registerInput('password')}
            accessibilityLabel="Password" autoComplete="new-password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              signUpForm.clearError('password');
            }}
            placeholder="Password (8+ letters & numbers)"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => signUpForm.focusInput('confirmPassword')}
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eye}
          >
            <HugeiconsIcon
              icon={showPassword ? ViewIcon : ViewOffIcon}
              size={19}
              color={colors.muted}
              strokeWidth={1.8}
            />
          </Pressable>
        </View>
        <FieldError message={signUpForm.errors.password} />
      </ShakeableField>

      <ShakeableField
        shakeKey={signUpForm.getShakeKey('confirmPassword')}
        onLayout={signUpForm.registerLayout('confirmPassword')}
        style={styles.fieldGroup}
      >
        <View
          style={[
            styles.inputBox,
            signUpForm.errors.confirmPassword ? styles.inputBoxError : null,
          ]}
        >
          <TextInput
            ref={signUpForm.registerInput('confirmPassword')}
            accessibilityLabel="Confirm password" autoComplete="new-password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              signUpForm.clearError('confirmPassword');
            }}
            placeholder="Confirm password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSignUp}
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
            }
            onPress={() => setShowConfirmPassword((prev) => !prev)}
            style={styles.eye}
          >
            <HugeiconsIcon
              icon={showConfirmPassword ? ViewIcon : ViewOffIcon}
              size={19}
              color={colors.muted}
              strokeWidth={1.8}
            />
          </Pressable>
        </View>
        <FieldError message={signUpForm.errors.confirmPassword} />
      </ShakeableField>
      {rolePicker}
      <Pressable accessibilityRole="button" onPress={handleSignUp}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
        <Text style={styles.primaryLabel}>Create account</Text>
      </Pressable>
    </View>
  );
}
