import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import Animated, {
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { INSECT_CATEGORIES } from "@/lib/insect-data";

function ExampleItem({ name, index }: { name: string; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(300 + index * 100)}
      style={styles.exampleItem}
    >
      <View style={styles.exampleIcon}>
        <Ionicons name="bug-outline" size={18} color={Colors.forestGreen} />
      </View>
      <Text style={styles.exampleName}>{name}</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
    </Animated.View>
  );
}

export default function InsectDetailScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;
  const params = useLocalSearchParams<{ categoryId: string }>();

  const category = INSECT_CATEGORIES.find((c) => c.id === params.categoryId);
  const backScale = useSharedValue(1);
  const backAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  if (!category) {
    return (
      <View style={styles.container}>
        <Text>Category not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[category.color, category.color + "CC", Colors.cream]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, { paddingTop: topPadding + 8 }]}
      >
        <Animated.View style={backAnimStyle}>
          <Pressable
            onPressIn={() => {
              backScale.value = withSpring(0.9);
            }}
            onPressOut={() => {
              backScale.value = withSpring(1);
            }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(100)}
          style={styles.headerContent}
        >
          <View
            style={[
              styles.categoryIconLarge,
              { backgroundColor: "rgba(255,255,255,0.2)" },
            ]}
          >
            <Ionicons
              name={category.icon as keyof typeof Ionicons.glyphMap}
              size={40}
              color="#fff"
            />
          </View>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryOrder}>{category.scientificOrder}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{category.count} species</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding + 20 }}
      >
        <Animated.View
          entering={FadeInUp.duration(500).delay(200)}
          style={styles.descCard}
        >
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.descText}>{category.description}</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(250)}
          style={styles.examplesCard}
        >
          <Text style={styles.sectionTitle}>Common Examples</Text>
          {category.examples.map((ex, i) => (
            <ExampleItem key={ex} name={ex} index={i} />
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(500).delay(350)}
          style={styles.tipCard}
        >
          <View style={styles.tipHeader}>
            <Ionicons name="camera" size={20} color={Colors.forestGreen} />
            <Text style={styles.tipTitle}>Identification Tip</Text>
          </View>
          <Text style={styles.tipText}>
            For the best identification results, photograph the insect from
            directly above in good lighting. Try to include distinctive features
            like wings, antennae, and leg structure.
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerContent: {
    alignItems: "center",
  },
  categoryIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
  },
  categoryOrder: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontStyle: "italic",
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
  },
  countText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },
  descCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  descText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  examplesCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  exampleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(30,86,49,0.05)",
  },
  exampleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(30,86,49,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  exampleName: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.textPrimary,
    flex: 1,
  },
  tipCard: {
    backgroundColor: Colors.forestGreen + "0A",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.forestGreen + "15",
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tipTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.forestGreen,
  },
  tipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
