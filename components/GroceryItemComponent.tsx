import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  DEFAULT_CATEGORIES,
  GroceryItem as GroceryItemType,
} from "@/types/grocery";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

interface GroceryItemProps {
  item: GroceryItemType;
  onToggleCompleted: () => void;
  onPress?: () => void;
  onDelete?: () => void;
}

export function GroceryItemComponent({
  item,
  onToggleCompleted,
  onPress,
  onDelete,
}: GroceryItemProps) {
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "text");

  const category = DEFAULT_CATEGORIES.find((cat) => cat.name === item.category);

  const priorityColors = {
    low: "#4CAF50",
    medium: "#FF9800",
    high: "#F44336",
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    );
  };

  return (
    <ThemedView style={[styles.container, { borderColor }]}>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={onToggleCompleted}
      >
        <IconSymbol
          name={item.completed ? "checkmark.circle.fill" : "circle"}
          size={24}
          color={item.completed ? "#4CAF50" : textColor}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.contentContainer} onPress={onPress}>
        <ThemedView style={styles.mainContent}>
          <ThemedView style={styles.headerRow}>
            <ThemedText
              style={[styles.itemName, item.completed && styles.completedText]}
              numberOfLines={1}
            >
              {item.name}
            </ThemedText>
            <ThemedView style={styles.rightContent}>
              <ThemedView
                style={[
                  styles.priorityIndicator,
                  { backgroundColor: priorityColors[item.priority] },
                ]}
              />
              {category && (
                <IconSymbol
                  name={category.icon as any}
                  size={16}
                  color={category.color}
                  style={styles.categoryIcon}
                />
              )}
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.detailsRow}>
            <ThemedText style={styles.quantity}>
              {item.quantity} {item.unit}
            </ThemedText>
            {item.price && (
              <ThemedText style={styles.price}>
                ${item.price.toFixed(2)}
              </ThemedText>
            )}
          </ThemedView>

          {item.notes && (
            <ThemedText style={styles.notes} numberOfLines={1}>
              {item.notes}
            </ThemedText>
          )}
        </ThemedView>
      </TouchableOpacity>

      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <IconSymbol name="trash" size={20} color="#F44336" />
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    backgroundColor: "transparent",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryIcon: {
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  quantity: {
    fontSize: 14,
    opacity: 0.7,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  notes: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: "italic",
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
});
