import { RecipeCard } from "@/components/RecipeCard";
import { Recipe } from "@/context/AppContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = [
	{ name: "Pizza", image: require("@/assets/images/pizza.png") },
	{ name: "Pasta", image: require("@/assets/images/pasta.png") },
	{ name: "Salad", image: require("@/assets/images/salad.png") },
	{ name: "Burger", image: require("@/assets/images/burger.png") },
	{ name: "Sushi", image: require("@/assets/images/sushi.png") },
	{ name: "Tacos", image: require("@/assets/images/tacos.png") },
];

const RecipeList = () => {
	const SAMPLE_RECIPES: Recipe[] = [
		{
			id: 1,
			name: "Veggie Stir Fry",
			description: "Quick and healthy stir fry with seasonal vegetables",
			time: "20 min",
			servings: 2,
			ingredients: [
				"Bell peppers",
				"Broccoli",
				"Carrots",
				"Soy sauce",
				"Garlic",
				"Ginger",
			],
			instructions: [
				"Chop all vegetables into bite-sized pieces",
				"Heat oil in a wok over high heat",
				"Add garlic and ginger, stir for 30 seconds",
				"Add vegetables and stir fry for 5-7 minutes",
				"Add soy sauce and toss to coat",
			],
			image: require("@/assets/images/veggie_stir_fry.jpg"),
		},
		{
			id: 2,
			name: "Pasta Primavera",
			description: "Classic Italian pasta with fresh garden vegetables",
			time: "25 min",
			servings: 4,
			ingredients: [
				"Pasta",
				"Zucchini",
				"Tomatoes",
				"Parmesan",
				"Olive oil",
				"Basil",
			],
			instructions: [
				"Cook pasta according to package directions",
				"Sauté zucchini in olive oil until tender",
				"Add tomatoes and cook for 2 minutes",
				"Toss with drained pasta",
				"Top with parmesan and fresh basil",
			],
			image: require("@/assets/images/pasta_primavera.jpg"),
		},
		{
			id: 3,
			name: "Chicken Salad",
			description: "Light and refreshing salad with grilled chicken",
			time: "15 min",
			servings: 2,
			ingredients: [
				"Chicken breast",
				"Mixed greens",
				"Cucumber",
				"Cherry tomatoes",
				"Olive oil",
				"Lemon",
			],
			instructions: [
				"Grill chicken breast until cooked through",
				"Let chicken rest, then slice",
				"Arrange greens on plates",
				"Top with cucumber, tomatoes, and chicken",
				"Drizzle with olive oil and lemon juice",
			],
			image: require("@/assets/images/chicken_salad.jpg"),
		},
		{
			id: 4,
			name: "Mushroom Omelette",
			description: "Fluffy eggs with sautéed mushrooms and herbs",
			time: "10 min",
			servings: 1,
			ingredients: ["Eggs", "Mushrooms", "Butter", "Chives", "Salt", "Pepper"],
			instructions: [
				"Sauté sliced mushrooms in butter",
				"Beat eggs with salt and pepper",
				"Pour eggs into pan over medium heat",
				"Add mushrooms to one side",
				"Fold omelette and serve with chives",
			],
			image: require("@/assets/images/mushroom_omlette.jpg"),
		},
	];
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.greeting}>Hello Friend!</Text>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.categoryScroll}
				contentContainerStyle={styles.categoryContainer}
			>
				{CATEGORIES.map((category) => (
					<TouchableOpacity key={category.name}>
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
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.recipeScroll}
				contentContainerStyle={styles.recipeContainer}
			>
				{SAMPLE_RECIPES.map((recipe) => (
					<RecipeCard key={recipe.id} recipe={recipe} onPress={() => {}} />
				))}
			</ScrollView>
		</SafeAreaView>
	);
};

export default RecipeList;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
	},
	greeting: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		paddingHorizontal: 16,
		paddingTop: 16,
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
	recipeScroll: {
		marginTop: 8,
	},
	recipeContainer: {
		paddingHorizontal: 16,
		gap: 12,
	},
});
