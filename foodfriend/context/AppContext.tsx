import { createContext, ReactNode, useContext, useState } from "react";

export type Ingredient = {
	name: string;
	quantity: number;
	unit: string;
};

export type Macros = {
	protein: number;
	carbs: number;
	fat: number;
	[key: string]: number;
};

export type Recipe = {
	id: number;
	name: string;
	description: string;
	time: string;
	servings: number;
	ingredients: Ingredient[];
	instructions: string[];
	category: string;
	macros?: Macros;
	image?: any;
};

export type Meal = {
	id: number;
	title: string;
	calories: number;
	date: string;
	carbs: string;
	protein: string;
	fat: string;
	fiber: string;
	vitamin_d: string;
	vitamin_a: string;
	vitamin_c: string;
	iron: string;
	calcium: string;
	magnesium: string;
	potassium: string;
	zinc: string;
	ingredients: string[];
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
