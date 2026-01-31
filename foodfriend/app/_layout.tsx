import { AppProvider } from "@/context/AppContext";
import { Stack } from "expo-router";

export default function RootLayout() {
	console.log(process.env.EXPO_PUBLIC_API_URL);
	return (
		<AppProvider>
			<Stack
				screenOptions={{
					headerShown: false,
				}}
			/>
		</AppProvider>
	);
}
