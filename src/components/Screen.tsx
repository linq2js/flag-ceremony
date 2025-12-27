import {
  Suspense,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { View, ActivityIndicator, StyleSheet, Animated } from "react-native";
import { ServiceLoader } from "./ServiceLoader";

interface ScreenProps {
  children: ReactNode;
}

function SuspenseLoadingTrigger({ onLoading }: { onLoading: () => void }) {
  useEffect(() => {
    onLoading();
  }, [onLoading]);
  return null;
}

function SuspenseFallbackLifecycle({
  onShow,
  onHide,
}: {
  onShow: () => void;
  onHide: () => void;
}) {
  useEffect(() => {
    onShow();
    return () => {
      onHide();
    };
  }, [onShow, onHide]);
  return null;
}

export function Screen({ children }: ScreenProps) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [overlayVisible, setOverlayVisible] = useState(false);

  const showOverlay = useCallback(() => {
    overlayOpacity.stopAnimation();
    overlayOpacity.setValue(1);
    setOverlayVisible(true);
  }, [overlayOpacity]);

  const hideOverlay = useCallback(() => {
    overlayOpacity.stopAnimation();
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setOverlayVisible(false);
      }
    });
  }, [overlayOpacity]);

  return (
    <View style={styles.root}>
      <Suspense
        fallback={
          <SuspenseFallbackLifecycle
            onShow={showOverlay}
            onHide={hideOverlay}
          />
        }
      >
        <ServiceLoader />
        {children}
      </Suspense>

      {overlayVisible && (
        <Animated.View
          style={[styles.loadingOverlay, { opacity: overlayOpacity }]}
        >
          <ActivityIndicator size="large" color="#fbbf24" />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
});
