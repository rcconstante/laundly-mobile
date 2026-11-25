import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import ViewIcon from '@hugeicons/core-free-icons/ViewIcon';
import ViewOffIcon from '@hugeicons/core-free-icons/ViewOffIcon';
import { colors } from '../../theme';
import { FieldError, ShakeableField } from './FieldError';
import { styles, type AuthFormProps } from './formStyles';
import { useFormFocus } from './useFormFocus';
import { isValidEmail } from './validation';

export function LoginForm({ onContinue, scrollTo, rolePicker }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const formOffsetYRef = useRef(0);
  const loginForm = useFormFocus<'email' | 'password'>();

  function handleLogin() {
    const fieldErrors: Partial<Record<'email' | 'password', string>> = {};
    if (!email.trim()) {
      fieldErrors.email = 'Please enter your email address.';
    } else if (!isValidEmail(email)) {
      fieldErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      fieldErrors.password = 'Please enter your password.';
    }

    if (loginForm.reportErrors(fieldErrors, ['email', 'password'], {
      scrollTo,
      containerOffsetY: formOffsetYRef.current,
    })) return;

    setPassword('');
    setShowPassword(false);
    onContinue();
  }

  return (
    <View style={styles.form} onLayout={(event) => { formOffsetYRef.current = event.nativeEvent.layout.y; }}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>Sign in to your account</Text>
        <Text style={styles.subtitle}>Enter your email and password to log in</Text>
      </View>
      <ShakeableField
        shakeKey={loginForm.getShakeKey('email')}
        onLayout={loginForm.registerLayout('email')}
        style={styles.fieldGroup}
      >
        <View
          style={[
            styles.inputBox,
            loginForm.errors.email ? styles.inputBoxError : null,
          ]}
        >
          <TextInput
            ref={loginForm.registerInput('email')}
            accessibilityLabel="Email address" autoComplete="email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              loginForm.clearError('email');
            }}
            placeholder="Email address"
            placeholderTextColor={colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => loginForm.focusInput('password')}
            style={styles.input}
          />
        </View>
        <FieldError message={loginForm.errors.email} />
      </ShakeableField>

      <ShakeableField
        shakeKey={loginForm.getShakeKey('password')}
        onLayout={loginForm.registerLayout('password')}
        style={styles.fieldGroup}
      >
        <View
          style={[
            styles.inputBox,
            loginForm.errors.password ? styles.inputBoxError : null,
          ]}
        >
          <TextInput
            ref={loginForm.registerInput('password')}
            accessibilityLabel="Password" autoComplete="current-password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              loginForm.clearError('password');
            }}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={() => void handleLogin()}
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
        <FieldError message={loginForm.errors.password} />
      </ShakeableField>
      {rolePicker}
      <Pressable accessibilityRole="button" onPress={handleLogin}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
        <Text style={styles.primaryLabel}>Log in</Text>
      </Pressable>
    </View>
  );
}
