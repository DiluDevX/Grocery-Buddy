import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { z } from "zod";

// Validation schemas
const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

const verificationSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must only contain numbers"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = "#4CAF50";

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [emailAddress, setEmailAddress] = React.useState("");

  const {
    control: signUpControl,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors, isValid: isSignUpValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control: verificationControl,
    handleSubmit: handleVerificationSubmit,
    formState: { errors: verificationErrors, isValid: isVerificationValid },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const onSignUpPress = async (data: SignUpFormData) => {
    if (!isLoaded) return;

    setLoading(true);
    setEmailAddress(data.email); // Store for verification screen

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        err.errors?.[0]?.message ||
          "Failed to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async (data: VerificationFormData) => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        Alert.alert("Error", "Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "Invalid verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <ThemedView style={styles.container}>
        {/* Form */}
        <ThemedView style={styles.form}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Verification Code</ThemedText>
            <Controller
              control={verificationControl}
              name="code"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.codeInput,
                    {
                      color: textColor,
                      borderColor: verificationErrors.code
                        ? "#FF3B30"
                        : textColor + "20",
                      backgroundColor: textColor + "05",
                    },
                  ]}
                  value={value}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor={textColor + "60"}
                  keyboardType="number-pad"
                  maxLength={6}
                  textAlign="center"
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {verificationErrors.code && (
              <ThemedText style={styles.errorText}>
                {verificationErrors.code.message}
              </ThemedText>
            )}
          </ThemedView>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              {
                backgroundColor: primaryColor,
                opacity: loading || !isVerificationValid ? 0.7 : 1,
              },
            ]}
            onPress={handleVerificationSubmit(onVerifyPress)}
            disabled={loading || !isVerificationValid}
          >
            <ThemedText style={styles.verifyButtonText}>
              {loading ? "Verifying..." : "Verify Email"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendCode}>
            <ThemedText
              style={[styles.resendCodeText, { color: primaryColor }]}
            >
              Didn&apos;t receive the code? Resend
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Form */}
      <ThemedView style={styles.form}>
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Email</ThemedText>
          <Controller
            control={signUpControl}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor: signUpErrors.email
                      ? "#FF3B30"
                      : textColor + "20",
                    backgroundColor: textColor + "05",
                  },
                ]}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={value}
                placeholder="Enter your email"
                placeholderTextColor={textColor + "60"}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {signUpErrors.email && (
            <ThemedText style={styles.errorText}>
              {signUpErrors.email.message}
            </ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Password</ThemedText>
          <Controller
            control={signUpControl}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor: signUpErrors.password
                      ? "#FF3B30"
                      : textColor + "20",
                    backgroundColor: textColor + "05",
                  },
                ]}
                value={value}
                placeholder="Create a strong password"
                placeholderTextColor={textColor + "60"}
                secureTextEntry={true}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {signUpErrors.password && (
            <ThemedText style={styles.errorText}>
              {signUpErrors.password.message}
            </ThemedText>
          )}
          <ThemedText style={styles.passwordHint}>
            Must contain uppercase, lowercase, and number
          </ThemedText>
        </ThemedView>

        <TouchableOpacity
          style={[
            styles.signUpButton,
            {
              backgroundColor: primaryColor,
              opacity: loading || !isSignUpValid ? 0.7 : 1,
            },
          ]}
          onPress={handleSignUpSubmit(onSignUpPress)}
          disabled={loading || !isSignUpValid}
        >
          <ThemedText style={styles.signUpButtonText}>
            {loading ? "Creating Account..." : "Create Account"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Footer */}
      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Already have an account?{" "}
          <Link href="/(auth)/signIn">
            <ThemedText style={[styles.linkText, { color: primaryColor }]}>
              Sign In
            </ThemedText>
          </Link>
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    minHeight: 56,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
  codeInput: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 8,
  },
  passwordHint: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  signUpButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  verifyButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verifyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resendCode: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  resendCodeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
  },
  linkText: {
    fontWeight: "600",
  },
});
