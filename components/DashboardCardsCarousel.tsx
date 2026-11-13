import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import WalletCard from "./WalletCard";
import CommissionCard from "./CommissionCard";
import RetailerPromotionCard from "./RetailerPromotionCard";

import colors from "../constants/colors";
import typography from "../constants/typography";

type DashboardCardsCarouselProps = {
  balance: string;
  packageName: string;
  commissions: number;
  onFundWallet: () => void;
  onViewHistory: () => void;
};

type CardType = "wallet" | "commissions" | "promotion";

const CARDS: CardType[] = ["wallet", "commissions", "promotion"];

const SWIPE_THRESHOLD = 60;

export default function DashboardCardsCarousel({
  balance,
  packageName,
  commissions,
  onFundWallet,
  onViewHistory,
}: DashboardCardsCarouselProps) {
  const { width } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);

  const activeIndexRef = useRef(0);
  const isAnimating = useRef(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const cardWidth = width - 32 - 22;

  const changeCard = useCallback(
    (direction: number) => {
      if (isAnimating.current) return;

      isAnimating.current = true;

      const nextIndex =
        (activeIndexRef.current + direction + CARDS.length) % CARDS.length;

      const destination = direction < 0 ? -width : width;

      Animated.timing(translateX, {
        toValue: destination,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);

        translateX.setValue(0);
        isAnimating.current = false;
      });
    },
    [translateX, width],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),

        onPanResponderMove: (_, gestureState) => {
          if (!isAnimating.current) {
            translateX.setValue(gestureState.dx);
          }
        },

        onPanResponderRelease: (_, gestureState) => {
          if (isAnimating.current) return;

          if (gestureState.dx < -SWIPE_THRESHOLD) {
            changeCard(1);
          } else if (gestureState.dx > SWIPE_THRESHOLD) {
            changeCard(-1);
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 80,
              friction: 10,
            }).start();
          }
        },
      }),
    [changeCard, translateX],
  );

  const renderCard = (card: CardType) => {
    switch (card) {
      case "wallet":
        return (
          <WalletCard
            balance={balance}
            packageName={packageName}
            onFundWallet={onFundWallet}
            onViewHistory={onViewHistory}
          />
        );

      case "commissions":
        return <CommissionCard commissions={commissions} />;

      case "promotion":
        return <RetailerPromotionCard />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.deck,
          {
            width: width - 32,
          },
        ]}
      >
        {CARDS.map((_, layerIndex) => {
          const cardIndex = (activeIndex + layerIndex) % CARDS.length;

          const card = CARDS[cardIndex];
          const isFrontCard = layerIndex === 0;

          return (
            <Animated.View
              key={card}
              pointerEvents={isFrontCard ? "auto" : "none"}
              {...(isFrontCard ? panResponder.panHandlers : {})}
              style={[
                styles.cardLayer,
                {
                  width: cardWidth,
                  zIndex: CARDS.length - layerIndex,
                  transform: isFrontCard
                    ? [{ translateX }, { scale: 1 }]
                    : [
                        { translateX: layerIndex * 12 },
                        { translateY: layerIndex * 7 },
                        { scale: 1 - layerIndex * 0.035 },
                      ],
                },
              ]}
            >
              {renderCard(card)}
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.pagination}>
        {CARDS.map((card, index) => (
          <View
            key={card}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      <Text style={styles.swipeHint}>Swipe to explore your cards</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },

  deck: {
    height: 215,
    position: "relative",
  },

  cardLayer: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: "#374151",
  },

  activeDot: {
    width: 19,
    backgroundColor: colors.primary,
  },

  swipeHint: {
    color: colors.muted,
    fontSize: 11,
    fontFamily: typography.fontFamily.body,
    textAlign: "center",
    marginTop: 7,
  },
});
