import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth, useUser } from "@clerk/clerk-expo";
import React from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleEditProfile = () => {
    Alert.alert(
      "Edit Profile",
      "Profile editing functionality would open here.",
    );
  };

  const handleChangePassword = () => {
    Alert.alert("Change Password", "Password change form would open here.");
  };

  const handleNotificationSettings = () => {
    Alert.alert(
      "Notification Settings",
      "Notification preferences would open here.",
    );
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.error("Error logging out:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const ProfileOption = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    danger = false,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <ThemedView style={styles.optionContent}>
        <ThemedView style={[styles.optionIcon, danger && styles.dangerIcon]}>
          <IconSymbol
            name={icon as any}
            size={24}
            color={danger ? "#FF3B30" : "#007AFF"}
          />
        </ThemedView>
        <ThemedView style={styles.optionText}>
          <ThemedText style={[styles.optionTitle, danger && styles.dangerText]}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText style={styles.optionSubtitle}>{subtitle}</ThemedText>
          )}
        </ThemedView>
        {showArrow && (
          <IconSymbol name="chevron.right" size={16} color={textColor + "60"} />
        )}
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={styles.avatarContainer}>
            <ThemedView style={styles.avatarPlaceholder}>
              <IconSymbol name="person.fill" size={40} color="#FFFFFF" />
            </ThemedView>
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleEditProfile}
            >
              <IconSymbol name="camera.fill" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </ThemedView>

          <ThemedText style={styles.userName}>
            {user?.primaryEmailAddress?.emailAddress.split("@")[0] || "User"}
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            {user?.primaryEmailAddress?.emailAddress || ""}
          </ThemedText>
        </ThemedView>

        {/* Profile Options */}
        <ThemedView style={styles.optionsSection}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>

          <ThemedView style={styles.optionsContainer}>
            <ProfileOption
              icon="person.circle"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={handleEditProfile}
            />

            <ProfileOption
              icon="lock"
              title="Change Password"
              subtitle="Update your account password"
              onPress={handleChangePassword}
            />

            <ProfileOption
              icon="bell"
              title="Notifications"
              subtitle="Manage notification preferences"
              onPress={handleNotificationSettings}
            />
          </ThemedView>
        </ThemedView>

        {/* App Options */}
        <ThemedView style={styles.optionsSection}>
          <ThemedText style={styles.sectionTitle}>App</ThemedText>

          <ThemedView style={styles.optionsContainer}>
            <ProfileOption
              icon="questionmark.circle"
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={() =>
                Alert.alert("Help", "Help center would open here.")
              }
            />

            <ProfileOption
              icon="star"
              title="Rate the App"
              subtitle="Leave a review on the App Store"
              onPress={() =>
                Alert.alert("Rate App", "App Store rating would open here.")
              }
            />

            <ProfileOption
              icon="info.circle"
              title="About"
              subtitle="App version and information"
              onPress={() =>
                Alert.alert(
                  "About",
                  "Grocery Buddy v1.0.0\nBuilt with ❤️ for better shopping",
                )
              }
            />
          </ThemedView>
        </ThemedView>

        {/* Logout */}
        <ThemedView style={styles.logoutSection}>
          <TouchableOpacity onPress={handleLogout}>
            <ThemedView style={styles.logoutButton}>
              <IconSymbol name="arrow.right.square" size={30} color="white" />
              <ThemedText style={styles.logoutText}>Logout</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    opacity: 0.6,
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#007AFF",
  },
  statTitle: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },
  optionsSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  optionsContainer: {
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  optionItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  dangerIcon: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  dangerText: {
    color: "#FF3B30",
  },
  optionSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  logoutSection: {
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
  logoutButton: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    textAlign: "center",
    color: "white",
  },
});
