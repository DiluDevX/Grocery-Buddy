import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Slot, useSegments } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthRoutesLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = "#4CAF50";
  const segments = useSegments();

  // Determine content based on current route
  const currentRoute = segments[segments.length - 1];
  const isSignUp = currentRoute === "signUp";

  // Check if we're in verification mode (this would need to be passed somehow)
  // For now, we'll default to the standard headers
  const headerContent = {
    icon: "cart.fill",
    title: isSignUp ? "Create Account" : "Welcome Back",
    subtitle: isSignUp
      ? "Join Grocery Buddy today!"
      : "Sign in to continue to Grocery Buddy",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ThemedView style={styles.content}>
          {/* Shared Header */}
          <ThemedView style={styles.header}>
            <ThemedView style={styles.iconContainer}>
              <IconSymbol
                name={headerContent.icon as any}
                size={48}
                color={primaryColor}
              />
            </ThemedView>
            <ThemedText style={styles.title}>{headerContent.title}</ThemedText>
            <ThemedText style={styles.subtitle}>
              {headerContent.subtitle}
            </ThemedText>
          </ThemedView>

          {/* Content from individual screens */}
          <Slot />
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 55,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    paddingTop: 11,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 24,
  },
});
