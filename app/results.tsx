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
import { Image } from "expo-image";
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function CharacteristicItem({ text, index }: { text: string; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(400 + index * 80)}
      style={styles.characteristicItem}
    >
      <View style={styles.bulletDot} />
      <Text style={styles.characteristicText}>{text}</Text>
    </Animated.View>
  );
}

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;
  const params = useLocalSearchParams<{
    imageUri: string;
    resultJson: string;
    historyId: string;
  }>();

  const result = params.resultJson ? JSON.parse(params.resultJson) : null;
  const closeScale = useSharedValue(1);
  const closeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScale.value }],
  }));

  if (!result) {
    return (
      <View style={styles.container}>
        <Text>No results available</Text>
      </View>
    );
  }

  const getConfidenceColor = (c: number) => {
    if (c >= 90) return Colors.forestGreen;
    if (c >= 70) return Colors.gold;
    return Colors.darkRed;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding + 20 }}
      >
        <View style={styles.imageSection}>
          {params.imageUri ? (
            <Image
              source={{ uri: params.imageUri }}
              style={styles.insectImage}
              contentFit="cover"
            />
          ) : (
            <LinearGradient
              colors={[Colors.darkGreen, Colors.forestGreen]}
              style={styles.insectImage}
            />
          )}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.imageOverlay}
          />
          <Animated.View
            style={[closeAnimStyle, styles.closeButton, { top: topPadding + 8 }]}
          >
            <Pressable
              onPressIn={() => {
                closeScale.value = withSpring(0.9);
              }}
              onPressOut={() => {
                closeScale.value = withSpring(1);
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
            >
              <View style={styles.closeButtonInner}>
                <Ionicons name="close" size={22} color="#fff" />
              </View>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(500).delay(200)}
            style={styles.imageTextOverlay}
          >
            <View style={styles.confidencePill}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={getConfidenceColor(result.confidence)}
              />
              <Text
                style={[
                  styles.confidenceValue,
                  { color: getConfidenceColor(result.confidence) },
                ]}
              >
                {result.confidence}% Match
              </Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.contentSection}>
          <Animated.View entering={FadeInUp.duration(500).delay(100)}>
            <Text style={styles.insectName}>{result.name}</Text>
            <Text style={styles.scientificName}>{result.scientificName}</Text>
            <View style={styles.categoryPill}>
              <Ionicons name="pricetag" size={12} color={Colors.gold} />
              <Text style={styles.categoryText}>{result.category}</Text>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(500).delay(200)}
            style={styles.infoCard}
          >
            <Text style={styles.cardSectionTitle}>Details</Text>
            <InfoRow label="Habitat" value={result.habitat} />
            <InfoRow label="Diet" value={result.diet} />
            <InfoRow label="Lifespan" value={result.lifespan} />
            <InfoRow label="Size" value={result.size} />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(500).delay(300)}
            style={styles.infoCard}
          >
            <Text style={styles.cardSectionTitle}>Key Characteristics</Text>
            {result.characteristics?.map((char: string, i: number) => (
              <CharacteristicItem key={i} text={char} index={i} />
            ))}
          </Animated.View>

          {result.funFact && (
            <Animated.View
              entering={FadeInUp.duration(500).delay(400)}
              style={styles.funFactCard}
            >
              <View style={styles.funFactHeader}>
                <Ionicons name="bulb" size={20} color={Colors.gold} />
                <Text style={styles.funFactTitle}>Fun Fact</Text>
              </View>
              <Text style={styles.funFactText}>{result.funFact}</Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  imageSection: {
    height: 320,
    position: "relative",
  },
  insectImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    zIndex: 10,
  },
  closeButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  imageTextOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  confidencePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  confidenceValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  insectName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.textPrimary,
  },
  scientificName: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.gold,
    fontStyle: "italic",
    marginTop: 2,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: Colors.gold + "15",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginTop: 8,
  },
  categoryText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.warmBrown,
  },
  infoCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSectionTitle: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(30,86,49,0.05)",
  },
  infoLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
    width: 80,
  },
  infoValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
  characteristicItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.forestGreen,
    marginTop: 5,
    marginRight: 10,
  },
  characteristicText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  funFactCard: {
    backgroundColor: Colors.gold + "10",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.gold + "25",
  },
  funFactHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  funFactTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.warmBrown,
  },
  funFactText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});
