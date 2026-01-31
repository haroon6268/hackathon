import { useAuth, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const PRIMARY = "#E9724C";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
	const { isSignedIn } = useAuth();
	const { startSSOFlow } = useSSO();

	if (isSignedIn) {
		return <Redirect href="/"></Redirect>;
	}

	const handleGoogleSignIn = async () => {
		try {
			const { createdSessionId, setActive } = await startSSOFlow({
				strategy: "oauth_google",
			});

			if (createdSessionId && setActive) {
				await setActive({ session: createdSessionId });
			}
		} catch (error) {
			console.error("OAuth error:", error);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Ionicons name="restaurant" size={80} color={PRIMARY} />
				<Text style={styles.title}>FoodFriend</Text>
				<Text style={styles.subtitle}>
					Snap your fridge, get delicious recipes
				</Text>

				<TouchableOpacity
					style={styles.googleButton}
					onPress={handleGoogleSignIn}
				>
					<Ionicons name="logo-google" size={24} color="#4285F4" />
					<Text style={styles.buttonText}>Continue with Google</Text>
				</TouchableOpacity>
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
		fontSize: 36,
		fontWeight: "bold",
		color: PRIMARY,
		marginTop: 16,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginBottom: 48,
	},
	googleButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 8,
		gap: 12,
		width: "100%",
		borderWidth: 1,
		borderColor: "#dadce0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	buttonText: {
		color: "#3c4043",
		fontSize: 16,
		fontWeight: "500",
	},
});
