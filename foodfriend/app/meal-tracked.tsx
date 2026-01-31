import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
	Dimensions,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const PRIMARY = "#E9724C";
const GREEN = "#4CAF50";
const screenWidth = Dimensions.get("window").width;

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
	const { meal: mealParam, fromHistory } = useLocalSearchParams<{
		meal: string;
		fromHistory?: string;
	}>();

	const meal: Meal | null = mealParam ? JSON.parse(mealParam) : null;
	const isFromHistory = fromHistory === "true";

	if (!meal) {
		return (
			<SafeAreaView style={styles.container}>
				<Text>Meal not found</Text>
			</SafeAreaView>
		);
	}

	// Parse macro values (remove 'g' suffix if present)
	const parseGrams = (val: string) =>
		parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
	const proteinGrams = parseGrams(meal.protein);
	const carbsGrams = parseGrams(meal.carbs);
	const fatGrams = parseGrams(meal.fat);

	const pieData = [
		{
			name: "Protein",
			grams: proteinGrams,
			color: "#4ECDC4",
			legendFontColor: "#333",
			legendFontSize: 14,
		},
		{
			name: "Carbs",
			grams: carbsGrams,
			color: "#FFE66D",
			legendFontColor: "#333",
			legendFontSize: 14,
		},
		{
			name: "Fat",
			grams: fatGrams,
			color: "#95E1D3",
			legendFontColor: "#333",
			legendFontSize: 14,
		},
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
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<Ionicons name="arrow-back" size={24} color={PRIMARY} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>
					{isFromHistory ? "Meal Details" : "Meal Tracked"}
				</Text>
				{!isFromHistory && (
					<View style={styles.checkBadge}>
						<Ionicons name="checkmark" size={20} color="#fff" />
					</View>
				)}
			</View>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
			>
				<Text style={styles.title}>{meal.title}</Text>
				<View style={styles.caloriesCard}>
					<Text style={styles.caloriesValue}>{meal.calories}</Text>
					<Text style={styles.caloriesLabel}>calories</Text>
				</View>
				<View style={styles.chartSection}>
					<Text style={styles.sectionTitle}>Macros</Text>
					<View style={styles.chartContainer}>
						<PieChart
							data={pieData}
							width={screenWidth}
							height={200}
							chartConfig={{
								color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
							}}
							accessor="grams"
							backgroundColor="transparent"
							paddingLeft="0"
							center={[100, 0]}
							hasLegend={false}
							absolute
						/>
					</View>
					<View style={styles.macroLegend}>
						<View style={styles.legendItem}>
							<View
								style={[styles.legendDot, { backgroundColor: "#4ECDC4" }]}
							/>
							<Text style={styles.legendText}>Protein: {meal.protein}</Text>
						</View>
						<View style={styles.legendItem}>
							<View
								style={[styles.legendDot, { backgroundColor: "#FFE66D" }]}
							/>
							<Text style={styles.legendText}>Carbs: {meal.carbs}</Text>
						</View>
						<View style={styles.legendItem}>
							<View
								style={[styles.legendDot, { backgroundColor: "#95E1D3" }]}
							/>
							<Text style={styles.legendText}>Fat: {meal.fat}</Text>
						</View>
					</View>
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

				{!isFromHistory && (
					<TouchableOpacity
						style={styles.doneButton}
						onPress={() => router.replace("/(tabs)")}
					>
						<Text style={styles.doneButtonText}>Done</Text>
					</TouchableOpacity>
				)}
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
		fontSize: 26,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
	},
	caloriesCard: {
		backgroundColor: "#FF6B6B",
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 20,
		alignSelf: "flex-start",
		flexDirection: "row",
		alignItems: "baseline",
		gap: 6,
		marginBottom: 20,
	},
	caloriesValue: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
	},
	caloriesLabel: {
		fontSize: 14,
		color: "rgba(255,255,255,0.9)",
	},
	chartSection: {
		marginBottom: 24,
	},
	chartContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 8,
	},
	macroLegend: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 8,
	},
	legendItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	legendDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
	},
	legendText: {
		fontSize: 13,
		color: "#333",
		fontWeight: "500",
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
