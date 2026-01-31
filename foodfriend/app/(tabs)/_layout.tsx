import { useAuth } from "@clerk/clerk-expo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Redirect, Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabLayout() {
	const { isSignedIn } = useAuth();
	if (!isSignedIn) {
		return <Redirect href="/sign-in" />;
	}
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#FFC857",
				tabBarStyle: styles.tabBar,
				headerShown: false,
				sceneStyle: {
					backgroundColor: "#fff",
				},
				tabBarInactiveTintColor: "#D3D3D3",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "lol",
					tabBarIcon: ({ color }) => (
						<FontAwesome size={28} name="home" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="create"
				options={{
					title: "Create",
					tabBarIcon: ({ color }) => (
						<FontAwesome size={28} name="fire" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	tabBar: {
		position: "absolute",
		height: 55,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		borderRadius: 40,
		bottom: 10,
		marginHorizontal: 100,
		borderTopWidth: 0,
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
	},
});
