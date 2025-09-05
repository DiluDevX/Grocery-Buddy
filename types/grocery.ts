export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price?: number;
  notes?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  addedDate: Date;
}

export interface GroceryList {
  id: string;
  name: string;
  items: GroceryItem[];
  createdDate: Date;
  completedDate?: Date;
  isArchived: boolean;
}

export interface GroceryCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const DEFAULT_CATEGORIES: GroceryCategory[] = [
  { id: "1", name: "Produce", icon: "leaf.fill", color: "#4CAF50" },
  { id: "2", name: "Dairy", icon: "drop.fill", color: "#2196F3" },
  { id: "3", name: "Meat", icon: "flame.fill", color: "#F44336" },
  { id: "4", name: "Bakery", icon: "birthday.cake.fill", color: "#FF9800" },
  { id: "5", name: "Beverages", icon: "cup.and.saucer.fill", color: "#9C27B0" },
  { id: "6", name: "Snacks", icon: "gift.fill", color: "#E91E63" },
  { id: "7", name: "Frozen", icon: "snowflake", color: "#00BCD4" },
  { id: "8", name: "Personal Care", icon: "heart.fill", color: "#FF5722" },
  { id: "9", name: "Household", icon: "house.fill", color: "#795548" },
  { id: "10", name: "Other", icon: "ellipsis.circle.fill", color: "#607D8B" },
];
