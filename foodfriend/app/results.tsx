import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "@/context/AppContext";

const PRIMARY = "#E9724C";

export default function Results() {
  const { imageUri, recipes } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={PRIMARY} />
        </TouchableOpacity>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.thumbnail} />
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Recipes for you</Text>
          <Text style={styles.headerSubtitle}>Based on your ingredients</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {recipes.map((recipe, index) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.listItem}
            onPress={() => router.push({ pathname: "/recipe", params: { index } })}
          >
            <View style={styles.listIcon}>
              <Ionicons name="restaurant" size={24} color="#fff" />
            </View>
            <View style={styles.listContent}>
              <Text style={styles.listTitle}>{recipe.name}</Text>
              <Text style={styles.listSubtitle}>{recipe.description}</Text>
              <View style={styles.listMeta}>
                <Ionicons name="time-outline" size={14} color="#999" />
                <Text style={styles.listMetaText}>{recipe.time}</Text>
                <Text style={styles.listMetaText}>•</Text>
                <Text style={styles.listMetaText}>{recipe.ingredients.length} ingredients</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
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
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    gap: 12,
  },
  listIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  listMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  listMetaText: {
    fontSize: 12,
    color: "#999",
  },
});
