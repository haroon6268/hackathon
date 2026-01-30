import { AppProvider } from "@/context/AppContext";
import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<AppProvider>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: "white" },
				}}
			/>
		</AppProvider>
	);
}
