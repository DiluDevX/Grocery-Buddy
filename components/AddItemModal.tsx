import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DEFAULT_CATEGORIES } from "@/types/grocery";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (item: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    price?: number;
    notes?: string;
    completed: boolean;
    priority: "low" | "medium" | "high";
  }) => void;
}

export function AddItemModal({
  visible,
  onClose,
  onAddItem,
}: AddItemModalProps) {
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    DEFAULT_CATEGORIES[0]
  );
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("pcs");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const units = [
    "pcs",
    "kg",
    "g",
    "lb",
    "oz",
    "L",
    "ml",
    "cups",
    "tbsp",
    "tsp",
  ];
  const priorities = [
    { key: "low", label: "Low", color: "#4CAF50" },
    { key: "medium", label: "Medium", color: "#FF9800" },
    { key: "high", label: "High", color: "#F44336" },
  ];

  const handleAddItem = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    const quantityNum = parseFloat(quantity) || 1;
    const priceNum = price ? parseFloat(price) : undefined;

    onAddItem({
      name: name.trim(),
      category: selectedCategory.name,
      quantity: quantityNum,
      unit,
      price: priceNum,
      notes: notes.trim() || undefined,
      completed: false,
      priority,
    });

    // Reset form
    setName("");
    setSelectedCategory(DEFAULT_CATEGORIES[0]);
    setQuantity("1");
    setUnit("pcs");
    setPrice("");
    setNotes("");
    setPriority("medium");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <ThemedText style={styles.cancelButton}>Cancel</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.title}>Add Item</ThemedText>
          <TouchableOpacity onPress={handleAddItem}>
            <ThemedText style={styles.addButton}>Add</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Item Name */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Item Name</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor: textColor + "30" },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter item name"
              placeholderTextColor={textColor + "60"}
            />
          </ThemedView>

          {/* Category */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Category</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {DEFAULT_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory.id === category.id &&
                      styles.selectedCategory,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <IconSymbol
                    name={category.icon as any}
                    size={24}
                    color={category.color}
                  />
                  <ThemedText style={styles.categoryText}>
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ThemedView>

          {/* Quantity and Unit */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Quantity</ThemedText>
            <ThemedView style={styles.row}>
              <TextInput
                style={[
                  styles.quantityInput,
                  { color: textColor, borderColor: textColor + "30" },
                ]}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="1"
                keyboardType="numeric"
                placeholderTextColor={textColor + "60"}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.unitScroll}
              >
                {units.map((unitOption) => (
                  <TouchableOpacity
                    key={unitOption}
                    style={[
                      styles.unitItem,
                      unit === unitOption && styles.selectedUnit,
                    ]}
                    onPress={() => setUnit(unitOption)}
                  >
                    <ThemedText style={styles.unitText}>
                      {unitOption}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ThemedView>
          </ThemedView>

          {/* Price */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Price (Optional)</ThemedText>
            <TextInput
              style={[
                styles.input,
                { color: textColor, borderColor: textColor + "30" },
              ]}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={textColor + "60"}
            />
          </ThemedView>

          {/* Priority */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Priority</ThemedText>
            <ThemedView style={styles.priorityContainer}>
              {priorities.map((priorityOption) => (
                <TouchableOpacity
                  key={priorityOption.key}
                  style={[
                    styles.priorityItem,
                    priority === priorityOption.key && [
                      styles.selectedPriority,
                      { borderColor: priorityOption.color },
                    ],
                  ]}
                  onPress={() => setPriority(priorityOption.key as any)}
                >
                  <ThemedView
                    style={[
                      styles.priorityIndicator,
                      { backgroundColor: priorityOption.color },
                    ]}
                  />
                  <ThemedText style={styles.priorityText}>
                    {priorityOption.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          {/* Notes */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.label}>Notes (Optional)</ThemedText>
            <TextInput
              style={[
                styles.textArea,
                { color: textColor, borderColor: textColor + "30" },
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any notes..."
              multiline
              numberOfLines={3}
              placeholderTextColor={textColor + "60"}
            />
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </Modal>
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
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    fontSize: 16,
    color: "#F44336",
  },
  addButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoryScroll: {
    flexDirection: "row",
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCategory: {
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF5020",
  },
  categoryText: {
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    width: 80,
    marginRight: 12,
  },
  unitScroll: {
    flex: 1,
  },
  unitItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedUnit: {
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF5020",
  },
  unitText: {
    fontSize: 14,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedPriority: {
    borderWidth: 2,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: "top",
  },
});
