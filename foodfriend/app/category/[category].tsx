import { Recipe } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const PRIMARY = "#E9724C";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const CATEGORY_COLORS: Record<string, [string, string]> = {
	pizza: ["#FF6B6B", "#EE5A5A"],
	pasta: ["#FFB347", "#FFA726"],
	salad: ["#66BB6A", "#4CAF50"],
	burger: ["#8D6E63", "#6D4C41"],
	sushi: ["#42A5F5", "#1E88E5"],
	tacos: ["#FFCA28", "#FFB300"],
	other: ["#AB47BC", "#8E24AA"],
};

export default function CategoryPage() {
	const { category } = useLocalSearchParams<{ category: string }>();
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchRecipes = async () => {
		try {
			const response = await fetch(
				`${API_URL}/global_recipe?category=${category}&limit=20`
			);
			if (response.ok) {
				const data = await response.json();
				const mappedRecipes: Recipe[] = data.map((item: any) => ({
					id: item.id,
					name: item.title,
					description: item.macros
						? `${item.macros.protein || 0}g protein, ${item.macros.carbs || 0}g carbs, ${item.macros.fat || 0}g fat`
						: "",
					time: "30 min",
					servings: 1,
					ingredients: item.ingredients,
					instructions: item.steps,
					category: item.category,
					macros: item.macros,
				}));
				setRecipes(mappedRecipes);
			}
		} catch (error) {
			console.error("Error fetching recipes:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (category) {
			fetchRecipes();
		}
	}, [category]);

	const categoryTitle = category
		? category.charAt(0).toUpperCase() + category.slice(1)
		: "";

	const getColors = (cat: string): [string, string] => {
		return CATEGORY_COLORS[cat] || CATEGORY_COLORS.other;
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={PRIMARY} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>{categoryTitle} Recipes</Text>
			</View>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={PRIMARY} />
				</View>
			) : recipes.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Ionicons name="restaurant-outline" size={48} color="#ccc" />
					<Text style={styles.emptyText}>No recipes found</Text>
				</View>
			) : (
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
				>
					<View style={styles.grid}>
						{recipes.map((recipe) => (
							<TouchableOpacity
								key={recipe.id}
								style={styles.recipeCard}
								onPress={() => router.push(`/saved/${recipe.id}`)}
							>
								<LinearGradient
									colors={getColors(recipe.category)}
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									style={styles.colorHeader}
								>
									<Ionicons name="restaurant" size={32} color="rgba(255,255,255,0.3)" />
								</LinearGradient>
								<View style={styles.recipeInfo}>
									<Text style={styles.recipeTitle} numberOfLines={2}>
										{recipe.name}
									</Text>
									<Text style={styles.recipeDescription} numberOfLines={1}>
										{recipe.description}
									</Text>
									<View style={styles.recipeMeta}>
										<Ionicons name="time-outline" size={12} color="#999" />
										<Text style={styles.recipeMetaText}>{recipe.time}</Text>
										<Text style={styles.recipeMetaDot}>•</Text>
										<Text style={styles.recipeMetaText}>
											{recipe.ingredients.length} items
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						))}
					</View>
				</ScrollView>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		gap: 12,
	},
	backButton: {
		padding: 4,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
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
		gap: 12,
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	recipeCard: {
		width: CARD_WIDTH,
		backgroundColor: "#fff",
		borderRadius: 16,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	colorHeader: {
		height: 80,
		alignItems: "center",
		justifyContent: "center",
	},
	recipeInfo: {
		padding: 12,
	},
	recipeTitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
		marginBottom: 4,
	},
	recipeDescription: {
		fontSize: 11,
		color: "#666",
		marginBottom: 8,
	},
	recipeMeta: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	recipeMetaText: {
		fontSize: 11,
		color: "#999",
	},
	recipeMetaDot: {
		fontSize: 11,
		color: "#ccc",
	},
});
