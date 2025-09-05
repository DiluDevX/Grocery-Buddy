import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { z } from "zod";

const { width } = Dimensions.get("window");

// Validation schema
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primaryColor = "#4CAF50";

  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInPress = async (data: SignInFormData) => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        err.errors?.[0]?.message ||
          "Failed to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Form */}
      <ThemedView style={styles.form}>
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Email</ThemedText>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor: errors.email ? "#FF3B30" : textColor + "20",
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
          {errors.email && (
            <ThemedText style={styles.errorText}>
              {errors.email.message}
            </ThemedText>
          )}
        </ThemedView>

        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Password</ThemedText>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    color: textColor,
                    borderColor: errors.password ? "#FF3B30" : textColor + "20",
                    backgroundColor: textColor + "05",
                  },
                ]}
                value={value}
                placeholder="Enter your password"
                placeholderTextColor={textColor + "60"}
                secureTextEntry={true}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.password && (
            <ThemedText style={styles.errorText}>
              {errors.password.message}
            </ThemedText>
          )}
        </ThemedView>

        <TouchableOpacity
          style={[
            styles.signInButton,
            {
              backgroundColor: primaryColor,
              opacity: loading || !isValid ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit(onSignInPress)}
          disabled={loading || !isValid}
        >
          <ThemedText style={styles.signInButtonText}>
            {loading ? "Signing In..." : "Sign In"}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <ThemedText
            style={[styles.forgotPasswordText, { color: primaryColor }]}
          >
            Forgot your password?
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Footer */}
      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Don&apos;t have an account?{" "}
          <Link href="/(auth)/signUp">
            <ThemedText style={[styles.linkText, { color: primaryColor }]}>
              Sign Up
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
  signInButton: {
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
  signInButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 8,
  },
  forgotPasswordText: {
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
