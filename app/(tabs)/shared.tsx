import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SharedListsScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  // Mock shared lists data - in a real app, this would come from a backend
  const [sharedLists] = useState([
    {
      id: "shared-1",
      name: "Family Grocery List",
      sharedBy: "Mom",
      sharedWith: ["Dad", "You", "Sister"],
      itemCount: 12,
      completedCount: 8,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isOwner: false,
    },
    {
      id: "shared-2",
      name: "Party Supplies",
      sharedBy: "You",
      sharedWith: ["Alex", "Jordan", "Casey"],
      itemCount: 25,
      completedCount: 15,
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isOwner: true,
    },
    {
      id: "shared-3",
      name: "Office Snacks",
      sharedBy: "Manager",
      sharedWith: ["Team"],
      itemCount: 8,
      completedCount: 3,
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isOwner: false,
    },
  ]);

  const handleShareList = () => {
    Alert.alert(
      "Share List",
      "Choose how you want to share your grocery list:",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Share via Link", onPress: () => generateShareLink() },
        { text: "Invite by Email", onPress: () => inviteByEmail() },
      ],
    );
  };

  const generateShareLink = () => {
    Alert.alert(
      "Share Link Generated",
      "Link copied to clipboard!\nAnyone with this link can view and edit your list.",
    );
  };

  const inviteByEmail = () => {
    Alert.alert(
      "Email Invite",
      "Enter email addresses to invite people to collaborate on your list.",
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const SharedListItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.listItem}>
      <ThemedView style={styles.listContent}>
        <ThemedView style={styles.listHeader}>
          <ThemedText style={styles.listName}>{item.name}</ThemedText>
          <ThemedView style={styles.ownerBadge}>
            <IconSymbol
              name={item.isOwner ? "crown" : "person.circle"}
              size={16}
              color={item.isOwner ? "#FFD700" : textColor}
            />
            <ThemedText style={styles.ownerText}>
              {item.isOwner ? "Owner" : item.sharedBy}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.listMeta}>
          <ThemedText style={styles.metaText}>
            {item.completedCount}/{item.itemCount} items completed
          </ThemedText>
          <ThemedText style={styles.metaText}>
            Updated {formatTimeAgo(item.lastUpdated)}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.progressContainer}>
          <ThemedView style={styles.progressBar}>
            <ThemedView
              style={[
                styles.progressFill,
                { width: `${(item.completedCount / item.itemCount) * 100}%` },
              ]}
            />
          </ThemedView>
          <ThemedText style={styles.progressPercent}>
            {Math.round((item.completedCount / item.itemCount) * 100)}%
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.sharedWith}>
          <IconSymbol name="person.2" size={14} color={textColor} />
          <ThemedText style={styles.sharedText}>
            Shared with {item.sharedWith.length} people
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Shared Lists</ThemedText>
        <ThemedView style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push("/(tabs)/settings")}
          >
            <IconSymbol name="gearshape" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareList}
          >
            <IconSymbol name="square.and.arrow.up" size={24} color="#007AFF" />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <FlatList
        data={sharedLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SharedListItem item={item} />}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="person.2" size={64} color={textColor + "40"} />
            <ThemedText style={styles.emptyTitle}>No Shared Lists</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Share your grocery lists with family and friends to collaborate on
              shopping
            </ThemedText>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleShareList}
            >
              <IconSymbol name="plus" size={20} color="#FFFFFF" />
              <ThemedText style={styles.createButtonText}>
                Share a List
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        }
        contentContainerStyle={
          sharedLists.length === 0 ? styles.emptyList : undefined
        }
      />

      <ThemedView style={styles.infoCard}>
        <IconSymbol name="info.circle" size={20} color="#007AFF" />
        <ThemedView style={styles.infoContent}>
          <ThemedText style={styles.infoTitle}>
            Collaboration Features
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Real-time updates across all devices{"\n"}• Add items and check
            them off together{"\n"}• See who added what and when
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  shareButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  list: {
    flex: 1,
  },
  listItem: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  listContent: {
    padding: 16,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  ownerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ownerText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  listMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metaText: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 3,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "500",
    minWidth: 40,
    textAlign: "right",
  },
  sharedWith: {
    flexDirection: "row",
    alignItems: "center",
  },
  sharedText: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 32,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: "row",
    margin: 16,
    padding: 16,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#007AFF",
  },
  infoText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
});
