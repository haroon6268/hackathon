import { AppProvider } from "@/context/AppContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";

export default function RootLayout() {
	useEffect(() => {
		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
	}, []);

	return (
		<ClerkProvider tokenCache={tokenCache}>
			<AppProvider>
				<Stack
					screenOptions={{
						headerShown: false,
					}}
				/>
			</AppProvider>
		</ClerkProvider>
	);
}
