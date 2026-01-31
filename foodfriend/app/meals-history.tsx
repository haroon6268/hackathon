import { Meal } from "@/context/AppContext";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { Calendar, DateData } from "react-native-calendars";

const PRIMARY = "#E9724C";
const GREEN = "#4CAF50";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const { width } = Dimensions.get("window");

export default function MealsHistory() {
	const { user } = useUser();
	const [selectedDate, setSelectedDate] = useState<string>(
		new Date().toISOString().split("T")[0]
	);
	const [meals, setMeals] = useState<Meal[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchMeals = async (date: string) => {
		if (!user) return;

		setLoading(true);
		try {
			const response = await fetch(
				`${API_URL}/meals/day?user_id=${user.id}&date=${date}&limit=50`
			);
			if (response.ok) {
				const data = await response.json();
				setMeals(data);
			}
		} catch (error) {
			console.error("Error fetching meals:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMeals(selectedDate);
	}, [selectedDate, user]);

	const onDayPress = (day: DateData) => {
		setSelectedDate(day.dateString);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
		});
	};

	const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color={PRIMARY} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Meal History</Text>
			</View>

			<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
				<Calendar
					onDayPress={onDayPress}
					markedDates={{
						[selectedDate]: {
							selected: true,
							selectedColor: PRIMARY,
						},
					}}
					theme={{
						todayTextColor: PRIMARY,
						arrowColor: PRIMARY,
						selectedDayBackgroundColor: PRIMARY,
						textDayFontWeight: "500",
						textMonthFontWeight: "bold",
						textDayHeaderFontWeight: "500",
					}}
					style={styles.calendar}
				/>

				<View style={styles.dateHeader}>
					<Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
					{meals.length > 0 && (
						<Text style={styles.totalCalories}>{totalCalories} kcal total</Text>
					)}
				</View>

				{loading ? (
					<ActivityIndicator size="large" color={PRIMARY} style={styles.loader} />
				) : meals.length === 0 ? (
					<View style={styles.emptyState}>
						<Ionicons name="nutrition-outline" size={48} color="#ccc" />
						<Text style={styles.emptyText}>No meals on this day</Text>
					</View>
				) : (
					<View style={styles.mealsList}>
						{meals.map((meal) => (
							<View key={meal.id} style={styles.mealCard}>
								<View style={styles.mealHeader}>
									<Text style={styles.mealTitle}>{meal.title}</Text>
									<Text style={styles.mealCalories}>{meal.calories} kcal</Text>
								</View>
								<View style={styles.mealMacros}>
									<View style={styles.macroItem}>
										<Text style={styles.macroValue}>{meal.protein}</Text>
										<Text style={styles.macroLabel}>Protein</Text>
									</View>
									<View style={styles.macroItem}>
										<Text style={styles.macroValue}>{meal.carbs}</Text>
										<Text style={styles.macroLabel}>Carbs</Text>
									</View>
									<View style={styles.macroItem}>
										<Text style={styles.macroValue}>{meal.fat}</Text>
										<Text style={styles.macroLabel}>Fat</Text>
									</View>
								</View>
								{meal.ingredients.length > 0 && (
									<View style={styles.ingredientsList}>
										{meal.ingredients.slice(0, 4).map((ingredient, i) => (
											<View key={i} style={styles.ingredientChip}>
												<Text style={styles.ingredientText}>{ingredient}</Text>
											</View>
										))}
										{meal.ingredients.length > 4 && (
											<Text style={styles.moreIngredients}>
												+{meal.ingredients.length - 4} more
											</Text>
										)}
									</View>
								)}
							</View>
						))}
					</View>
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
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 32,
	},
	calendar: {
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	dateHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#f9f9f9",
	},
	selectedDateText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	totalCalories: {
		fontSize: 14,
		fontWeight: "bold",
		color: GREEN,
	},
	loader: {
		marginTop: 48,
	},
	emptyState: {
		alignItems: "center",
		paddingVertical: 64,
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
		marginTop: 12,
	},
	mealsList: {
		padding: 16,
		gap: 12,
	},
	mealCard: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: "#eee",
	},
	mealHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	mealTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		flex: 1,
	},
	mealCalories: {
		fontSize: 16,
		fontWeight: "bold",
		color: GREEN,
	},
	mealMacros: {
		flexDirection: "row",
		gap: 16,
		marginBottom: 12,
	},
	macroItem: {
		alignItems: "center",
	},
	macroValue: {
		fontSize: 14,
		fontWeight: "600",
		color: "#333",
	},
	macroLabel: {
		fontSize: 11,
		color: "#666",
		marginTop: 2,
	},
	ingredientsList: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 6,
		alignItems: "center",
	},
	ingredientChip: {
		backgroundColor: `${PRIMARY}15`,
		paddingVertical: 4,
		paddingHorizontal: 10,
		borderRadius: 12,
	},
	ingredientText: {
		fontSize: 12,
		color: PRIMARY,
	},
	moreIngredients: {
		fontSize: 12,
		color: "#999",
	},
});
