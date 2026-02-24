import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { INSECT_CATEGORIES, type InsectCategory } from "@/lib/insect-data";
import { useI18n } from "@/lib/i18n";

function CategoryCard({
  item,
  index,
}: {
  item: InsectCategory;
  index: number;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const { t } = useI18n();

  const localName = t(`categories.${item.id}.name`);
  const localDesc = t(`categories.${item.id}.description`);

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 80)}
      style={animStyle}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.97);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push({
            pathname: "/insect-detail",
            params: { categoryId: item.id },
          });
        }}
        style={styles.card}
      >
        <View style={[styles.cardIconBg, { backgroundColor: item.color + "18" }]}>
          <Ionicons
            name={item.icon as keyof typeof Ionicons.glyphMap}
            size={28}
            color={item.color}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{localName}</Text>
          <Text style={styles.cardOrder}>{item.scientificOrder}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {localDesc}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.cardCount}>{item.count}</Text>
          <Text style={styles.cardSpecies}>{t("encyclopedia.species")}</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={Colors.textMuted}
            style={{ marginTop: 4 }}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function EncyclopediaScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const { t } = useI18n();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.darkGreen, Colors.forestGreen + "90", Colors.cream]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.header, { paddingTop: topPadding + 12 }]}
      >
        <Text style={styles.headerTitle}>{t("encyclopedia.title")}</Text>
        <Text style={styles.headerSubtitle}>
          {t("encyclopedia.subtitle", { count: INSECT_CATEGORIES.length })}
        </Text>
      </LinearGradient>

      <FlatList
        data={INSECT_CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <CategoryCard item={item} index={index} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!INSECT_CATEGORIES.length}
      />
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.textPrimary,
  },
  cardOrder: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.gold,
    fontStyle: "italic",
    marginTop: 1,
  },
  cardDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  cardRight: {
    alignItems: "center",
    marginLeft: 8,
  },
  cardCount: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.forestGreen,
  },
  cardSpecies: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
