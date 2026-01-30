import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAppContext, Recipe } from "@/context/AppContext";

const PRIMARY = "#E9724C";

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 1,
    name: "Veggie Stir Fry",
    description: "Quick and healthy stir fry with seasonal vegetables",
    time: "20 min",
    servings: 2,
    ingredients: ["Bell peppers", "Broccoli", "Carrots", "Soy sauce", "Garlic", "Ginger"],
    instructions: [
      "Chop all vegetables into bite-sized pieces",
      "Heat oil in a wok over high heat",
      "Add garlic and ginger, stir for 30 seconds",
      "Add vegetables and stir fry for 5-7 minutes",
      "Add soy sauce and toss to coat",
    ],
  },
  {
    id: 2,
    name: "Pasta Primavera",
    description: "Classic Italian pasta with fresh garden vegetables",
    time: "25 min",
    servings: 4,
    ingredients: ["Pasta", "Zucchini", "Tomatoes", "Parmesan", "Olive oil", "Basil"],
    instructions: [
      "Cook pasta according to package directions",
      "Sauté zucchini in olive oil until tender",
      "Add tomatoes and cook for 2 minutes",
      "Toss with drained pasta",
      "Top with parmesan and fresh basil",
    ],
  },
  {
    id: 3,
    name: "Chicken Salad",
    description: "Light and refreshing salad with grilled chicken",
    time: "15 min",
    servings: 2,
    ingredients: ["Chicken breast", "Mixed greens", "Cucumber", "Cherry tomatoes", "Olive oil", "Lemon"],
    instructions: [
      "Grill chicken breast until cooked through",
      "Let chicken rest, then slice",
      "Arrange greens on plates",
      "Top with cucumber, tomatoes, and chicken",
      "Drizzle with olive oil and lemon juice",
    ],
  },
  {
    id: 4,
    name: "Mushroom Omelette",
    description: "Fluffy eggs with sautéed mushrooms and herbs",
    time: "10 min",
    servings: 1,
    ingredients: ["Eggs", "Mushrooms", "Butter", "Chives", "Salt", "Pepper"],
    instructions: [
      "Sauté sliced mushrooms in butter",
      "Beat eggs with salt and pepper",
      "Pour eggs into pan over medium heat",
      "Add mushrooms to one side",
      "Fold omelette and serve with chives",
    ],
  },
];

export default function Index() {
  const { setImageUri, setRecipes } = useAppContext();

  const handleImageSelected = (uri: string) => {
    setImageUri(uri);
    setRecipes(SAMPLE_RECIPES); // Later: replace with API call
    router.push("/results");
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
});
