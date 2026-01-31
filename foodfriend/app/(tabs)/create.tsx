import { Recipe, useAppContext } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { router } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const PRIMARY = "#E9724C";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Index() {
	const { setImageUri, setRecipes } = useAppContext();
	const [loading, setLoading] = useState(false);

	const uploadImage = async (uri: string) => {
		// Convert to JPEG to ensure compatibility (handles iOS HEIC)
		const converted = await ImageManipulator.manipulateAsync(
			uri,
			[],
			{ compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
		);

		const formData = new FormData();

		formData.append("file", {
			uri: converted.uri,
			name: "photo.jpg",
			type: "image/jpeg",
		} as any);

		const response = await fetch(`${API_URL}`, {
			method: "POST",
			body: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to upload image");
		}

		return response.json();
	};

	const handleImageSelected = async (uri: string) => {
		setImageUri(uri);
		setLoading(true);

		try {
			const data = await uploadImage(uri);

			// Convert API response to Recipe format
			const recipe: Recipe = {
				id: 1,
				name: data.title,
				description: `${data.macros.protein}g protein, ${data.macros.carbs}g carbs, ${data.macros.fat}g fat`,
				time: "30 min",
				servings: 1,
				ingredients: data.ingredients,
				instructions: data.steps,
			};

			setRecipes([recipe]);
			router.push("/results");
		} catch (error) {
			console.error("Error uploading image:", error);
			alert("Failed to analyze image. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const takePhoto = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== "granted") {
			alert("Camera permission is required");
			return;
		}

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ["images"],
			quality: 0.8,
		});

		if (!result.canceled) {
			handleImageSelected(result.assets[0].uri);
		}
	};

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			quality: 0.8,
		});

		if (!result.canceled) {
			handleImageSelected(result.assets[0].uri);
		}
	};

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.content}>
					<ActivityIndicator size="large" color={PRIMARY} />
					<Text style={styles.loadingText}>Analyzing your ingredients...</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>FoodFriend</Text>
				<Text style={styles.tagline}>Snap your fridge, get recipes</Text>

				<View style={styles.iconContainer}>
					<Ionicons name="restaurant-outline" size={120} color={PRIMARY} />
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button} onPress={takePhoto}>
						<Ionicons name="camera" size={24} color="#fff" />
						<Text style={styles.buttonText}>Take Photo</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.button} onPress={pickImage}>
						<Ionicons name="images" size={24} color="#fff" />
						<Text style={styles.buttonText}>Choose from Gallery</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	content: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 32,
	},
	title: {
		fontSize: 42,
		fontWeight: "bold",
		color: PRIMARY,
		marginBottom: 8,
	},
	tagline: {
		fontSize: 18,
		color: "#666",
		marginBottom: 48,
	},
	iconContainer: {
		marginBottom: 48,
	},
	buttonContainer: {
		width: "100%",
		gap: 16,
	},
	button: {
		backgroundColor: PRIMARY,
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 12,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "600",
	},
	loadingText: {
		marginTop: 16,
		fontSize: 18,
		color: "#666",
	},
});
