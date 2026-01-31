import { useAppContext } from "@/context/AppContext";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const PRIMARY = "#E9724C";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RecipeDetail() {
	const { index } = useLocalSearchParams<{ index: string }>();
	const { recipes } = useAppContext();
	const { user } = useUser();
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);

	const recipe = recipes[Number(index)];

	const saveRecipe = async () => {
		if (!recipe || !user) return;

		setSaving(true);
		try {
			const body = {
				title: recipe.name,
				ingredients: recipe.ingredients,
				macros: recipe.macros || {},
				steps: recipe.instructions,
			};

			const response = await fetch(
				`${API_URL}/recipe/save?user_id=${user.id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(body),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.error("Save error details:", errorData);
				throw new Error("Failed to save recipe");
			}

			setSaved(true);
			Alert.alert("Saved!", "Recipe has been saved to your collection.");
		} catch (error) {
			console.error("Error saving recipe:", error);
			Alert.alert("Error", "Failed to save recipe. Please try again.");
		} finally {
			setSaving(false);
		}
	};

	if (!recipe) {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Recipe not found</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<Ionicons name="arrow-back" size={24} color={PRIMARY} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>{recipe.name}</Text>
				<TouchableOpacity
					onPress={saveRecipe}
					style={styles.saveButton}
					disabled={saving || saved}
				>
					{saving ? (
						<ActivityIndicator size="small" color={PRIMARY} />
					) : (
						<Ionicons
							name={saved ? "bookmark" : "bookmark-outline"}
							size={24}
							color={PRIMARY}
						/>
					)}
				</TouchableOpacity>
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
			>
				<Text style={styles.description}>{recipe.description}</Text>

				<View style={styles.metaRow}>
					<View style={styles.metaItem}>
						<Ionicons name="time-outline" size={20} color={PRIMARY} />
						<Text style={styles.metaText}>{recipe.time}</Text>
					</View>
					<View style={styles.metaItem}>
						<Ionicons name="people-outline" size={20} color={PRIMARY} />
						<Text style={styles.metaText}>{recipe.servings} servings</Text>
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
					{recipe.instructions.map((step, i) => (
						<View key={i} style={styles.stepRow}>
							<View style={styles.stepNumber}>
								<Text style={styles.stepNumberText}>{i + 1}</Text>
							</View>
							<Text style={styles.stepText}>{step}</Text>
						</View>
					))}
				</View>
			</ScrollView>
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
	saveButton: {
		padding: 4,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
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
