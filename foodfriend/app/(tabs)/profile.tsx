import { useAppContext } from "@/context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Image,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const PRIMARY = "#E9724C";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

type SavedRecipe = {
	id: number;
	title: string;
	ingredients: { name: string; quantity: number; unit: string }[];
	macros: { protein?: number; carbs?: number; fat?: number };
	steps: string[];
};

export default function Profile() {
	const { user } = useUser();
	const { signOut } = useAuth();
	const { setRecipes } = useAppContext();
	const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchSavedRecipes = async () => {
		if (!user) return;

		try {
			const response = await fetch(`${API_URL}/recipe?user_id=${user.id}`);
			if (response.ok) {
				const data = await response.json();
				setSavedRecipes(data);
			}
		} catch (error) {
			console.error("Error fetching saved recipes:", error);
		} finally {
			setLoading(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchSavedRecipes();
		}, [user])
	);

	const openRecipe = (recipe: SavedRecipe) => {
		setRecipes([
			{
				id: recipe.id,
				name: recipe.title,
				description: recipe.macros
					? `${recipe.macros.protein || 0}g protein, ${recipe.macros.carbs || 0}g carbs, ${recipe.macros.fat || 0}g fat`
					: "",
				time: "30 min",
				servings: 1,
				ingredients: recipe.ingredients,
				instructions: recipe.steps,
				macros: recipe.macros,
			},
		]);
		router.push({ pathname: "/recipe", params: { index: 0 } });
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.profileHeader}>
					{user?.imageUrl ? (
						<Image source={{ uri: user.imageUrl }} style={styles.avatar} />
					) : (
						<View style={styles.avatarPlaceholder}>
							<Ionicons name="person" size={40} color="#999" />
						</View>
					)}
					<Text style={styles.name}>
						{user?.firstName} {user?.lastName}
					</Text>
					<Text style={styles.email}>
						{user?.primaryEmailAddress?.emailAddress}
					</Text>
					<TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
						<Ionicons name="log-out-outline" size={18} color="#666" />
						<Text style={styles.logoutText}>Sign out</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Saved Recipes</Text>
					{loading ? (
						<ActivityIndicator size="large" color={PRIMARY} style={styles.loader} />
					) : savedRecipes.length === 0 ? (
						<View style={styles.emptyState}>
							<Ionicons name="bookmark-outline" size={48} color="#ccc" />
							<Text style={styles.emptyText}>No saved recipes yet</Text>
							<Text style={styles.emptySubtext}>
								Snap your ingredients to get started
							</Text>
						</View>
					) : (
						<View style={styles.recipeList}>
							{savedRecipes.map((recipe) => (
								<TouchableOpacity
									key={recipe.id}
									style={styles.recipeCard}
									onPress={() => openRecipe(recipe)}
								>
									<View style={styles.recipeIcon}>
										<Ionicons name="restaurant" size={24} color="#fff" />
									</View>
									<View style={styles.recipeInfo}>
										<Text style={styles.recipeTitle}>{recipe.title}</Text>
										<Text style={styles.recipeMeta}>
											{recipe.ingredients.length} ingredients
										</Text>
									</View>
									<Ionicons name="chevron-forward" size={20} color="#ccc" />
								</TouchableOpacity>
							))}
						</View>
					)}
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
	content: {
		padding: 16,
	},
	profileHeader: {
		alignItems: "center",
		paddingVertical: 24,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		marginBottom: 24,
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 12,
	},
	avatarPlaceholder: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "#f0f0f0",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
	},
	name: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 4,
	},
	email: {
		fontSize: 14,
		color: "#666",
		marginBottom: 16,
	},
	logoutButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		backgroundColor: "#f5f5f5",
	},
	logoutText: {
		fontSize: 14,
		color: "#666",
	},
	section: {
		flex: 1,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
	},
	loader: {
		marginTop: 32,
	},
	emptyState: {
		alignItems: "center",
		paddingVertical: 48,
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
		marginTop: 12,
	},
	emptySubtext: {
		fontSize: 14,
		color: "#999",
		marginTop: 4,
	},
	recipeList: {
		gap: 12,
	},
	recipeCard: {
		flexDirection: "row",
		alignItems: "center",
		padding: 12,
		backgroundColor: "#fff",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#eee",
		gap: 12,
	},
	recipeIcon: {
		width: 48,
		height: 48,
		borderRadius: 12,
		backgroundColor: PRIMARY,
		alignItems: "center",
		justifyContent: "center",
	},
	recipeInfo: {
		flex: 1,
	},
	recipeTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 2,
	},
	recipeMeta: {
		fontSize: 13,
		color: "#666",
	},
});
