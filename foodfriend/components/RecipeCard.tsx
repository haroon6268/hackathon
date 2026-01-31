import { Text, View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { Recipe } from "@/context/AppContext";

type RecipeCardProps = {
  recipe: Recipe;
  onPress: () => void;
};

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {recipe.image && (
        <Image source={recipe.image} style={styles.image} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.recipeName} numberOfLines={1}>{recipe.name}</Text>
        <Text style={styles.timeText}>{recipe.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 240,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 175,
    resizeMode: "cover",
  },
  textContainer: {
    padding: 12,
    flex: 1,
    justifyContent: "center",
  },
  recipeName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
  },
});
