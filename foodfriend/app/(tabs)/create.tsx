import { Recipe, useAppContext } from "@/context/AppContext";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const PRIMARY = "#E9724C";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Mode = "recipe" | "track";

export default function Create() {
	const { setImageUri, setRecipes } = useAppContext();
	const { user } = useUser();
	const [loading, setLoading] = useState(false);
	const [facing, setFacing] = useState<"front" | "back">("back");
	const [mode, setMode] = useState<Mode>("recipe");
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView>(null);

	const uploadImageForRecipe = async (uri: string) => {
		const converted = await ImageManipulator.manipulateAsync(uri, [], {
			compress: 0.8,
			format: ImageManipulator.SaveFormat.JPEG,
		});

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

	const uploadImageForTracking = async (uri: string) => {
		const converted = await ImageManipulator.manipulateAsync(uri, [], {
			compress: 0.8,
			format: ImageManipulator.SaveFormat.JPEG,
		});

		const formData = new FormData();
		formData.append("file", {
			uri: converted.uri,
			name: "photo.jpg",
			type: "image/jpeg",
		} as any);

		const response = await fetch(`${API_URL}/track_meal?user_id=${user?.id}`, {
			method: "POST",
			body: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		if (!response.ok) {
			throw new Error("Failed to track meal");
		}

		return response.json();
	};

	const handleRecipeMode = async (uri: string) => {
		setImageUri(uri);
		setLoading(true);

		try {
			const data = await uploadImageForRecipe(uri);

			const recipe: Recipe = {
				id: 1,
				name: data.title,
				description: `${data.macros.protein}g protein, ${data.macros.carbs}g carbs, ${data.macros.fat}g fat`,
				time: "30 min",
				servings: 1,
				ingredients: data.ingredients,
				instructions: data.steps,
				macros: data.macros,
				category: data.category || "other",
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

	const handleTrackMode = async (uri: string) => {
		setLoading(true);

		try {
			const data = await uploadImageForTracking(uri);
			router.push({
				pathname: "/meal-tracked",
				params: { meal: JSON.stringify(data) },
			});
		} catch (error) {
			console.error("Error tracking meal:", error);
			alert("Failed to track meal. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleImageSelected = async (uri: string) => {
		if (mode === "recipe") {
			await handleRecipeMode(uri);
		} else {
			await handleTrackMode(uri);
		}
	};

	const takePhoto = async () => {
		if (!cameraRef.current) return;

		const photo = await cameraRef.current.takePictureAsync();
		if (photo) {
			handleImageSelected(photo.uri);
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

	const toggleFacing = () => {
		setFacing((prev) => (prev === "back" ? "front" : "back"));
	};

	if (!permission) {
		return <View style={styles.container} />;
	}

	if (!permission.granted) {
		return (
			<View style={styles.permissionContainer}>
				<Ionicons name="camera-outline" size={64} color="#666" />
				<Text style={styles.permissionText}>
					Camera access is needed to snap your ingredients
				</Text>
				<TouchableOpacity
					style={styles.permissionButton}
					onPress={requestPermission}
				>
					<Text style={styles.permissionButtonText}>Enable Camera</Text>
				</TouchableOpacity>
			</View>
		);
	}

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={PRIMARY} />
				<Text style={styles.loadingText}>
					{mode === "recipe" ? "Analyzing your ingredients..." : "Tracking your meal..."}
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<CameraView ref={cameraRef} style={styles.camera} facing={facing}>
				<View style={styles.modeToggleContainer}>
					<View style={styles.modeToggle}>
						<TouchableOpacity
							style={[styles.modeButton, mode === "recipe" && styles.modeButtonActive]}
							onPress={() => setMode("recipe")}
						>
							<Ionicons
								name="restaurant-outline"
								size={18}
								color={mode === "recipe" ? "#fff" : "rgba(255,255,255,0.6)"}
							/>
							<Text style={[styles.modeText, mode === "recipe" && styles.modeTextActive]}>
								Recipe
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.modeButton, mode === "track" && styles.modeButtonActive]}
							onPress={() => setMode("track")}
						>
							<Ionicons
								name="nutrition-outline"
								size={18}
								color={mode === "track" ? "#fff" : "rgba(255,255,255,0.6)"}
							/>
							<Text style={[styles.modeText, mode === "track" && styles.modeTextActive]}>
								Track
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.overlay}>
					<Text style={styles.hint}>
						{mode === "recipe" ? "Snap your ingredients" : "Snap your meal"}
					</Text>
				</View>

				<View style={styles.controls}>
					<TouchableOpacity style={styles.sideButton} onPress={pickImage}>
						<Ionicons name="images" size={28} color="#fff" />
					</TouchableOpacity>

					<TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
						<View style={[styles.captureInner, mode === "track" && styles.captureInnerTrack]} />
					</TouchableOpacity>

					<TouchableOpacity style={styles.sideButton} onPress={toggleFacing}>
						<Ionicons name="camera-reverse" size={28} color="#fff" />
					</TouchableOpacity>
				</View>
			</CameraView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
	camera: {
		flex: 1,
	},
	modeToggleContainer: {
		position: "absolute",
		top: 60,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	modeToggle: {
		flexDirection: "row",
		backgroundColor: "rgba(0,0,0,0.4)",
		borderRadius: 25,
		padding: 4,
	},
	modeButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		gap: 6,
	},
	modeButtonActive: {
		backgroundColor: PRIMARY,
	},
	modeText: {
		color: "rgba(255,255,255,0.6)",
		fontSize: 14,
		fontWeight: "500",
	},
	modeTextActive: {
		color: "#fff",
	},
	overlay: {
		position: "absolute",
		top: 120,
		left: 0,
		right: 0,
		alignItems: "center",
	},
	hint: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "500",
		textShadowColor: "rgba(0,0,0,0.5)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 4,
	},
	controls: {
		position: "absolute",
		bottom: 80,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 40,
	},
	captureButton: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: "rgba(255,255,255,0.3)",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 4,
		borderColor: "#fff",
	},
	captureInner: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: "#fff",
	},
	captureInnerTrack: {
		backgroundColor: "#4CAF50",
	},
	sideButton: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	permissionContainer: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 32,
		gap: 16,
	},
	permissionText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
	permissionButton: {
		backgroundColor: PRIMARY,
		paddingVertical: 14,
		paddingHorizontal: 28,
		borderRadius: 12,
		marginTop: 8,
	},
	permissionButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: "#000",
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		marginTop: 16,
		fontSize: 18,
		color: "#fff",
	},
});
