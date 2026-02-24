import React, { useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { addToHistory } from "@/lib/history-storage";
import { SAMPLE_RESULTS } from "@/lib/insect-data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function ActionButton({
  icon,
  label,
  subtitle,
  onPress,
  variant,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle: string;
  onPress: () => void;
  variant: "primary" | "secondary";
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isPrimary = variant === "primary";

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.96);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={onPress}
        style={[
          styles.actionButton,
          isPrimary ? styles.primaryButton : styles.secondaryButton,
        ]}
        testID={`action-${label.toLowerCase().replace(/\s/g, "-")}`}
      >
        <View
          style={[
            styles.actionIconContainer,
            {
              backgroundColor: isPrimary
                ? "rgba(255,255,255,0.2)"
                : "rgba(30,86,49,0.08)",
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={26}
            color={isPrimary ? "#fff" : Colors.forestGreen}
          />
        </View>
        <View style={styles.actionTextContainer}>
          <Text
            style={[
              styles.actionLabel,
              { color: isPrimary ? "#fff" : Colors.textPrimary },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.actionSubtitle,
              {
                color: isPrimary
                  ? "rgba(255,255,255,0.7)"
                  : Colors.textSecondary,
              },
            ]}
          >
            {subtitle}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isPrimary ? "rgba(255,255,255,0.6)" : Colors.textMuted}
        />
      </Pressable>
    </Animated.View>
  );
}

function SmallCard({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.smallCardOuter, animStyle]}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.95);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        onPress={onPress}
        style={styles.smallCard}
      >
        <View style={styles.smallCardIcon}>
          <Ionicons name={icon} size={22} color={Colors.forestGreen} />
        </View>
        <Text style={styles.smallCardLabel}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const simulateIdentification = useCallback(
    async (imageUri: string) => {
      const result = SAMPLE_RESULTS[0];
      const historyItem = {
        id: Crypto.randomUUID(),
        name: result.name,
        scientificName: result.scientificName,
        confidence: result.confidence,
        imageUri,
        date: new Date().toISOString(),
        category: result.category,
      };
      await addToHistory(historyItem);
      router.push({
        pathname: "/results",
        params: {
          imageUri,
          resultJson: JSON.stringify(result),
          historyId: historyItem.id,
        },
      });
    },
    []
  );

  const handleTakePhoto = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera access is needed to identify insects."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      simulateIdentification(result.assets[0].uri);
    }
  }, [simulateIdentification]);

  const handleUploadPhoto = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Photo library access is needed to identify insects."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      simulateIdentification(result.assets[0].uri);
    }
  }, [simulateIdentification]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.darkGreen, "#1B4332", Colors.forestGreen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      />
      <View style={[styles.content, { paddingTop: topPadding + 16 }]}>
        <Animated.View
          entering={FadeInUp.duration(600).delay(100)}
          style={styles.heroSection}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
          <Text style={styles.appName}>InsectaID</Text>
          <Text style={styles.appSubtitle}>
            AI-Powered Insect Identification
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(600).delay(250)}
          style={styles.statsRow}
        >
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1M+</Text>
            <Text style={styles.statLabel}>Species</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2s</Text>
            <Text style={styles.statLabel}>Avg Time</Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(400)}
          style={styles.actionsSection}
        >
          <Text style={styles.sectionTitle}>Identify an Insect</Text>
          <ActionButton
            icon="camera"
            label="Take Photo"
            subtitle="Use camera for instant identification"
            onPress={handleTakePhoto}
            variant="primary"
          />
          <ActionButton
            icon="images"
            label="Upload from Gallery"
            subtitle="Choose an existing photo to analyze"
            onPress={handleUploadPhoto}
            variant="secondary"
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(550)}
          style={styles.quickLinksRow}
        >
          <SmallCard
            icon="book"
            label="Insect Types"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(tabs)/encyclopedia");
            }}
          />
          <SmallCard
            icon="time"
            label="History"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(tabs)/history");
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 360,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 32,
    color: "#fff",
    letterSpacing: 1,
  },
  appSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.gold,
  },
  statLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  actionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "PlayfairDisplay_600SemiBold",
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: Colors.forestGreen,
  },
  secondaryButton: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  actionSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  quickLinksRow: {
    flexDirection: "row",
    gap: 12,
  },
  smallCardOuter: {
    flex: 1,
  },
  smallCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  smallCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(30,86,49,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  smallCardLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textPrimary,
  },
});
