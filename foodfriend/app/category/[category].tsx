import { Recipe } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	Image,
	ImageSourcePropType,
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

const CATEGORY_IMAGES: Record<string, ImageSourcePropType> = {
	pizza: require("@/assets/images/cat_pizza.png"),
	pasta: require("@/assets/images/pasta_cat.png"),
	salad: require("@/assets/images/salad_cat.png"),
	burger: require("@/assets/images/burger_cat.png"),
	sushi: require("@/assets/images/sushi_cat.png"),
	tacos: require("@/assets/images/tacos_cat.png"),
	other: require("@/assets/images/other_cat.png"),
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
					image: CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES.other,
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
								<Image
									source={recipe.image as ImageSourcePropType}
									style={styles.recipeImage}
								/>
								<View style={styles.recipeInfo}>
									<Text style={styles.recipeTitle} numberOfLines={2}>
										{recipe.name}
									</Text>
									<Text style={styles.recipeMeta}>
										{recipe.ingredients.length} ingredients
									</Text>
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
		gap: 16,
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
	recipeImage: {
		width: "100%",
		height: CARD_WIDTH,
		resizeMode: "cover",
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
	recipeMeta: {
		fontSize: 12,
		color: "#999",
	},
});
