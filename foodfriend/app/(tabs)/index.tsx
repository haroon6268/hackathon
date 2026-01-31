import { RecipeCard } from "@/components/RecipeCard";
import { Recipe } from "@/context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	ImageSourcePropType,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const CATEGORIES = [
	{ name: "Pizza", key: "pizza", image: require("@/assets/images/pizza.png") },
	{ name: "Pasta", key: "pasta", image: require("@/assets/images/pasta.png") },
	{ name: "Salad", key: "salad", image: require("@/assets/images/salad.png") },
	{
		name: "Burger",
		key: "burger",
		image: require("@/assets/images/burger.png"),
	},
	{ name: "Sushi", key: "sushi", image: require("@/assets/images/sushi.png") },
	{ name: "Tacos", key: "tacos", image: require("@/assets/images/tacos.png") },
];

const RecipeList = () => {
	const { signOut } = useAuth();
	const { user } = useUser();
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchRecipes = async () => {
		try {
			const response = await fetch(`${API_URL}/global_recipe?limit=10`);
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
		fetchRecipes();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.greeting}>
					Hello {user?.firstName || "Friend"}!
				</Text>
				<TouchableOpacity onPress={() => signOut()}>
					<Ionicons name="log-out-outline" size={24} color="#666" />
				</TouchableOpacity>
			</View>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.categoryScroll}
				contentContainerStyle={styles.categoryContainer}
			>
				{CATEGORIES.map((category) => (
					<TouchableOpacity
						key={category.key}
						onPress={() => router.push(`/category/${category.key}`)}
					>
						<LinearGradient
							colors={["#FFD166", "#F4A623"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.categoryCard}
						>
							<Image source={category.image} style={styles.categoryImage} />
							<Text style={styles.categoryText}>{category.name}</Text>
						</LinearGradient>
					</TouchableOpacity>
				))}
			</ScrollView>

			{loading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#E9724C" />
				</View>
			) : (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={styles.recipeScroll}
					contentContainerStyle={styles.recipeContainer}
				>
					{recipes.map((recipe) => (
						<RecipeCard key={recipe.id} recipe={recipe} onPress={() => router.push(`/saved/${recipe.id}`)} />
					))}
				</ScrollView>
			)}
		</SafeAreaView>
	);
};

export default RecipeList;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 16,
	},
	greeting: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
	},
	categoryScroll: {
		padding: 16,
	},
	categoryContainer: {
		paddingRight: 16,
		gap: 10,
	},
	categoryCard: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 20,
		height: 80,
		width: 100,
		justifyContent: "flex-end",
		alignItems: "flex-start",
		overflow: "hidden",
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 4,
	},
	categoryImage: {
		position: "absolute",
		top: 5,
		right: 5,
		width: 50,
		height: 50,
	},
	categoryText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 14,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 60,
	},
	recipeScroll: {
		marginTop: 8,
	},
	recipeContainer: {
		paddingHorizontal: 16,
		gap: 12,
	},
});
