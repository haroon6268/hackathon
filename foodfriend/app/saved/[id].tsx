import { Ionicons } from "@expo/vector-icons";
import { Image, ImageSource } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const PRIMARY = "#E9724C";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const CATEGORY_IMAGES: Record<string, ImageSource> = {
	pizza: require("@/assets/images/cat_pizza.png"),
	pasta: require("@/assets/images/pasta_cat.png"),
	salad: require("@/assets/images/salad_cat.png"),
	burger: require("@/assets/images/burger_cat.png"),
	sushi: require("@/assets/images/sushi_cat.png"),
	tacos: require("@/assets/images/tacos_cat.png"),
	other: require("@/assets/images/other_cat.png"),
};

type SavedRecipe = {
	id: number;
	title: string;
	ingredients: { name: string; quantity: number; unit: string }[];
	macros: { protein?: number; carbs?: number; fat?: number };
	steps: string[];
	category?: string;
};

export default function SavedRecipeDetail() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const [recipe, setRecipe] = useState<SavedRecipe | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (id) {
			fetchRecipe(id);
		}
	}, [id]);

	const fetchRecipe = async (recipeId: string) => {
		try {
			const response = await fetch(`${API_URL}/recipe/${recipeId}`);
			if (response.ok) {
				const data = await response.json();
				setRecipe(data);
			}
		} catch (error) {
			console.error("Error fetching recipe:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={PRIMARY} />
				</View>
			</SafeAreaView>
		);
	}

	if (!recipe) {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Recipe not found</Text>
			</SafeAreaView>
		);
	}

	const description = recipe.macros
		? `${recipe.macros.protein || 0}g protein, ${recipe.macros.carbs || 0}g carbs, ${recipe.macros.fat || 0}g fat`
		: "";

	const recipeImage = CATEGORY_IMAGES[recipe.category || "other"] || CATEGORY_IMAGES.other;

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image
					source={recipeImage}
					style={styles.image}
					contentFit="cover"
					cachePolicy="memory-disk"
					transition={200}
				/>
				<SafeAreaView style={styles.imageOverlay}>
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={24} color="#fff" />
					</TouchableOpacity>
				</SafeAreaView>
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
			>
				<Text style={styles.title}>{recipe.title}</Text>
				<Text style={styles.description}>{description}</Text>

				<View style={styles.metaRow}>
					<View style={styles.metaItem}>
						<Ionicons name="time-outline" size={20} color={PRIMARY} />
						<Text style={styles.metaText}>30 min</Text>
					</View>
					<View style={styles.metaItem}>
						<Ionicons name="people-outline" size={20} color={PRIMARY} />
						<Text style={styles.metaText}>1 serving</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Ingredients</Text>
					{recipe.ingredients.map((ingredient, i) => (
						<View key={i} style={styles.ingredientRow}>
							<View style={styles.bullet} />
							<Text style={styles.ingredientText}>
								{ingredient.quantity} {ingredient.unit} {ingredient.name}
							</Text>
						</View>
					))}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Instructions</Text>
					{recipe.steps.map((step, i) => (
						<View key={i} style={styles.stepRow}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>{i + 1}</Text>
							</View>
							<Text style={styles.stepText}>{step}</Text>
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	loadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	imageContainer: {
		height: 250,
		backgroundColor: "#f0f0f0",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	imageOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
	},
	backButton: {
		margin: 16,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(0,0,0,0.3)",
		alignItems: "center",
		justifyContent: "center",
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
	},
	description: {
		fontSize: 16,
		color: "#666",
		marginBottom: 16,
	},
	metaRow: {
		flexDirection: "row",
		gap: 24,
		marginBottom: 24,
	},
	metaItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	metaText: {
		fontSize: 14,
		color: "#333",
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: PRIMARY,
		marginBottom: 12,
	},
	ingredientRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: 8,
	},
	bullet: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: PRIMARY,
	},
	ingredientText: {
		fontSize: 16,
		color: "#333",
	},
	stepRow: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 12,
	},
	stepNumber: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: PRIMARY,
		alignItems: "center",
		justifyContent: "center",
	},
	stepNumberText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 14,
	},
	stepText: {
		fontSize: 16,
		color: "#333",
		flex: 1,
		lineHeight: 24,
	},
});
