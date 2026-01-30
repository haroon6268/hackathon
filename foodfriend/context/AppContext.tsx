import { createContext, useContext, useState, ReactNode } from "react";

export type Recipe = {
  id: number;
  name: string;
  description: string;
  time: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
};

type AppContextType = {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  return (
    <AppContext.Provider value={{ imageUri, setImageUri, recipes, setRecipes }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
