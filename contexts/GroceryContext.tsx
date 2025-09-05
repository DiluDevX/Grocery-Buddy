import { DEFAULT_CATEGORIES, GroceryItem, GroceryList } from "@/types/grocery";
import React, { createContext, useContext, useState } from "react";

interface GroceryContextType {
  lists: GroceryList[];
  activeList: GroceryList | null;
  setActiveList: (list: GroceryList | null) => void;
  createList: (name: string) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  addItem: (
    listId: string,
    item: Omit<GroceryItem, "id" | "addedDate">,
  ) => Promise<void>;
  updateItem: (
    listId: string,
    itemId: string,
    updates: Partial<GroceryItem>,
  ) => Promise<void>;
  deleteItem: (listId: string, itemId: string) => Promise<void>;
  toggleItemCompleted: (listId: string, itemId: string) => Promise<void>;
  archiveList: (listId: string) => Promise<void>;
  categories: typeof DEFAULT_CATEGORIES;
  loading: boolean;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export function GroceryProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [activeList, setActiveList] = useState<GroceryList | null>(null);
  const [loading] = useState(false);

  const createList = async (name: string) => {
    const newList: GroceryList = {
      id: Date.now().toString(),
      name,
      items: [],
      createdDate: new Date(),
      isArchived: false,
    };

    const newLists = [...lists, newList];
    setLists(newLists);
    setActiveList(newList);
  };

  const deleteList = async (listId: string) => {
    const newLists = lists.filter((list) => list.id !== listId);
    setLists(newLists);

    if (activeList?.id === listId) {
      const remainingList = newLists.find((list) => !list.isArchived);
      setActiveList(remainingList || null);
    }
  };

  const addItem = async (
    listId: string,
    itemData: Omit<GroceryItem, "id" | "addedDate">,
  ) => {
    const newItem: GroceryItem = {
      ...itemData,
      id: Date.now().toString(),
      addedDate: new Date(),
    };

    const newLists = lists.map((list) =>
      list.id === listId ? { ...list, items: [...list.items, newItem] } : list,
    );

    setLists(newLists);

    // Update active list if it's the one being modified
    if (activeList?.id === listId) {
      const updatedActiveList = newLists.find((list) => list.id === listId);
      setActiveList(updatedActiveList || null);
    }
  };

  const updateItem = async (
    listId: string,
    itemId: string,
    updates: Partial<GroceryItem>,
  ) => {
    const newLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item,
            ),
          }
        : list,
    );

    setLists(newLists);

    if (activeList?.id === listId) {
      const updatedActiveList = newLists.find((list) => list.id === listId);
      setActiveList(updatedActiveList || null);
    }
  };

  const deleteItem = async (listId: string, itemId: string) => {
    const newLists = lists.map((list) =>
      list.id === listId
        ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
        : list,
    );

    setLists(newLists);

    if (activeList?.id === listId) {
      const updatedActiveList = newLists.find((list) => list.id === listId);
      setActiveList(updatedActiveList || null);
    }
  };

  const toggleItemCompleted = async (listId: string, itemId: string) => {
    const newLists = lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map((item) =>
              item.id === itemId
                ? { ...item, completed: !item.completed }
                : item,
            ),
          }
        : list,
    );

    setLists(newLists);

    if (activeList?.id === listId) {
      const updatedActiveList = newLists.find((list) => list.id === listId);
      setActiveList(updatedActiveList || null);
    }
  };

  const archiveList = async (listId: string) => {
    const newLists = lists.map((list) =>
      list.id === listId
        ? { ...list, isArchived: true, completedDate: new Date() }
        : list,
    );

    setLists(newLists);

    if (activeList?.id === listId) {
      const remainingList = newLists.find((list) => !list.isArchived);
      setActiveList(remainingList || null);
    }
  };

  const value: GroceryContextType = {
    lists,
    activeList,
    setActiveList,
    createList,
    deleteList,
    addItem,
    updateItem,
    deleteItem,
    toggleItemCompleted,
    archiveList,
    categories: DEFAULT_CATEGORIES,
    loading,
  };

  return (
    <GroceryContext.Provider value={value}>{children}</GroceryContext.Provider>
  );
}

export function useGrocery() {
  const context = useContext(GroceryContext);
  if (context === undefined) {
    throw new Error("useGrocery must be used within a GroceryProvider");
  }
  return context;
}
