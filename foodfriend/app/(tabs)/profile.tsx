import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
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

const PRIMARY = "#E9724C";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const CATEGORY_IMAGES: Record<string, ImageSourcePropType> = {
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

export default function Profile() {
	const { user } = useUser();
	const { signOut } = useAuth();
	const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchSavedRecipes = async () => {
		if (!user) return;

		try {
			const response = await fetch(`${API_URL}/user_recipe?user_id=${user.id}`);
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
		}, [user]),
	);

	const openRecipe = (recipe: SavedRecipe) => {
		router.push(`/saved/${recipe.id}`);
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
					<TouchableOpacity
						style={styles.logoutButton}
						onPress={() => signOut()}
					>
						<Ionicons name="log-out-outline" size={18} color="#666" />
						<Text style={styles.logoutText}>Sign out</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Saved Recipes</Text>
					{loading ? (
						<ActivityIndicator
							size="large"
							color={PRIMARY}
							style={styles.loader}
						/>
					) : savedRecipes.length === 0 ? (
						<View style={styles.emptyState}>
							<Ionicons name="bookmark-outline" size={48} color="#ccc" />
							<Text style={styles.emptyText}>No saved recipes yet</Text>
							<Text style={styles.emptySubtext}>
								Snap your ingredients to get started
							</Text>
						</View>
					) : (
						<View style={styles.grid}>
							{savedRecipes.map((recipe) => (
								<TouchableOpacity
									key={recipe.id}
									style={styles.recipeCard}
									onPress={() => openRecipe(recipe)}
								>
									<Image
										source={CATEGORY_IMAGES[recipe.category || "other"] || CATEGORY_IMAGES.other}
										style={styles.recipeImage}
									/>
									<View style={styles.recipeInfo}>
										<Text style={styles.recipeTitle} numberOfLines={2}>
											{recipe.title}
										</Text>
										<Text style={styles.recipeMeta}>
											{recipe.ingredients.length} ingredients
										</Text>
									</View>
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
