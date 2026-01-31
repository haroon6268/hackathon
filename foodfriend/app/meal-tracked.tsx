import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const PRIMARY = "#E9724C";
const GREEN = "#4CAF50";

type Meal = {
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

export default function MealTracked() {
	const { meal: mealParam } = useLocalSearchParams<{ meal: string }>();

	const meal: Meal | null = mealParam ? JSON.parse(mealParam) : null;

	if (!meal) {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Meal not found</Text>
			</SafeAreaView>
		);
	}

	const macros = [
		{ label: "Calories", value: `${meal.calories}`, unit: "kcal", color: "#FF6B6B" },
		{ label: "Protein", value: meal.protein, unit: "", color: "#4ECDC4" },
		{ label: "Carbs", value: meal.carbs, unit: "", color: "#FFE66D" },
		{ label: "Fat", value: meal.fat, unit: "", color: "#95E1D3" },
	];

	const nutrients = [
		{ label: "Fiber", value: meal.fiber },
		{ label: "Vitamin A", value: meal.vitamin_a },
		{ label: "Vitamin C", value: meal.vitamin_c },
		{ label: "Vitamin D", value: meal.vitamin_d },
		{ label: "Calcium", value: meal.calcium },
		{ label: "Iron", value: meal.iron },
		{ label: "Magnesium", value: meal.magnesium },
		{ label: "Potassium", value: meal.potassium },
		{ label: "Zinc", value: meal.zinc },
	];

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={PRIMARY} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Meal Tracked</Text>
				<View style={styles.checkBadge}>
					<Ionicons name="checkmark" size={20} color="#fff" />
				</View>
			</View>

			<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
				<Text style={styles.title}>{meal.title}</Text>

				<View style={styles.macrosGrid}>
					{macros.map((macro) => (
						<View key={macro.label} style={[styles.macroCard, { borderLeftColor: macro.color }]}>
							<Text style={styles.macroValue}>
								{macro.value}
								{macro.unit && <Text style={styles.macroUnit}> {macro.unit}</Text>}
							</Text>
							<Text style={styles.macroLabel}>{macro.label}</Text>
						</View>
					))}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Nutrients</Text>
					<View style={styles.nutrientsGrid}>
						{nutrients.map((nutrient) => (
							<View key={nutrient.label} style={styles.nutrientItem}>
								<Text style={styles.nutrientValue}>{nutrient.value}</Text>
								<Text style={styles.nutrientLabel}>{nutrient.label}</Text>
							</View>
						))}
					</View>
				</View>

				{meal.ingredients.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Ingredients Detected</Text>
						<View style={styles.ingredientsList}>
							{meal.ingredients.map((ingredient, i) => (
								<View key={i} style={styles.ingredientChip}>
									<Text style={styles.ingredientText}>{ingredient}</Text>
								</View>
							))}
						</View>
					</View>
				)}

				<TouchableOpacity
					style={styles.doneButton}
					onPress={() => router.replace("/(tabs)")}
				>
					<Text style={styles.doneButtonText}>Done</Text>
				</TouchableOpacity>
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
	checkBadge: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: GREEN,
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
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 24,
	},
	macrosGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
		marginBottom: 32,
	},
	macroCard: {
		width: "47%",
		backgroundColor: "#f9f9f9",
		borderRadius: 12,
		padding: 16,
		borderLeftWidth: 4,
	},
	macroValue: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	macroUnit: {
		fontSize: 14,
		fontWeight: "normal",
		color: "#666",
	},
	macroLabel: {
		fontSize: 14,
		color: "#666",
		marginTop: 4,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginBottom: 16,
	},
	nutrientsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	nutrientItem: {
		width: "31%",
		backgroundColor: "#f5f5f5",
		borderRadius: 8,
		padding: 12,
		alignItems: "center",
	},
	nutrientValue: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
	},
	nutrientLabel: {
		fontSize: 11,
		color: "#666",
		marginTop: 4,
		textAlign: "center",
	},
	ingredientsList: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	ingredientChip: {
		backgroundColor: "#E9724C20",
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: 20,
	},
	ingredientText: {
		fontSize: 14,
		color: PRIMARY,
		fontWeight: "500",
	},
	doneButton: {
		backgroundColor: GREEN,
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 16,
	},
	doneButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "600",
	},
});
