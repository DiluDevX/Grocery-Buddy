import { AddItemModal } from "@/components/AddItemModal";
import { GroceryItemComponent } from "@/components/GroceryItemComponent";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useGrocery } from "@/contexts/GroceryContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroceryListScreen() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const {
    activeList,
    createList,
    addItem,
    toggleItemCompleted,
    deleteItem,
    archiveList,
    loading,
  } = useGrocery();

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const handleCreateNewList = () => {
    Alert.prompt(
      "New Grocery List",
      "Enter a name for your new grocery list:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: (text) => {
            if (text?.trim()) {
              createList(text.trim());
            }
          },
        },
      ],
      "plain-text",
      "",
      "default",
    );
  };

  const handleAddItem = async (itemData: any) => {
    if (activeList) {
      await addItem(activeList.id, itemData);
    }
  };

  const handleArchiveList = () => {
    if (activeList) {
      Alert.alert(
        "Archive List",
        `Are you sure you want to archive "${activeList.name}"? This will move it to completed lists.`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Archive", onPress: () => archiveList(activeList.id) },
        ],
      );
    }
  };

  const completedItems =
    activeList?.items.filter((item) => item.completed) || [];
  const pendingItems =
    activeList?.items.filter((item) => !item.completed) || [];
  const totalItems = activeList?.items.length || 0;
  const completedCount = completedItems.length;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (!activeList) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.emptyContainer}>
          <IconSymbol name="cart" size={64} color={textColor + "40"} />
          <ThemedText style={styles.emptyTitle}>No Grocery List</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Create your first grocery list to get started
          </ThemedText>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateNewList}
          >
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
            <ThemedText style={styles.createButtonText}>Create List</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedView style={styles.headerTop}>
          <ThemedText style={styles.listTitle}>{activeList.name}</ThemedText>
          <ThemedView style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push("/(tabs)/settings")}
            >
              <IconSymbol name="person.circle" size={24} color={textColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleArchiveList}>
              <IconSymbol name="archivebox" size={24} color={textColor} />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {totalItems > 0 && (
          <ThemedView style={styles.progressContainer}>
            <ThemedText style={styles.progressText}>
              {completedCount} of {totalItems} items completed
            </ThemedText>
            <ThemedView style={styles.progressBar}>
              <ThemedView
                style={[
                  styles.progressFill,
                  { width: `${(completedCount / totalItems) * 100}%` },
                ]}
              />
            </ThemedView>
          </ThemedView>
        )}
      </ThemedView>

      {/* Item List */}
      <FlatList
        data={[...pendingItems, ...completedItems]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroceryItemComponent
            item={item}
            onToggleCompleted={() =>
              toggleItemCompleted(activeList.id, item.id)
            }
            onDelete={() => deleteItem(activeList.id, item.id)}
          />
        )}
        ListEmptyComponent={
          <ThemedView style={styles.emptyListContainer}>
            <IconSymbol
              name="cart.badge.plus"
              size={48}
              color={textColor + "40"}
            />
            <ThemedText style={styles.emptyListText}>
              Your grocery list is empty
            </ThemedText>
            <ThemedText style={styles.emptyListSubtext}>
              Tap the + button to add your first item
            </ThemedText>
          </ThemedView>
        }
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Action Buttons */}
      <ThemedView style={styles.actionBar}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <IconSymbol name="plus" size={20} color="#FFFFFF" />
          <ThemedText style={styles.addButtonText}>Add Item</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.newListButton}
          onPress={handleCreateNewList}
        >
          <IconSymbol
            name="plus.rectangle.on.folder"
            size={20}
            color="#007AFF"
          />
          <ThemedText style={styles.newListButtonText}>New List</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Add Item Modal */}
      <AddItemModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAddItem={handleAddItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  listTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  list: {
    flex: 1,
  },
  emptyListContainer: {
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyListSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
  },
  actionBar: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingRight: 20,
  },
  newListButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
    marginTop: 12,
  },
  newListButtonText: {
    color: "#007AFF",
    fontWeight: "500",
    marginLeft: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
});
