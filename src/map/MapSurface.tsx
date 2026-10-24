import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { formatDurationMinutes } from "../format";
import type { Coordinates, MapPlace } from "../geo";
import { uiText } from "../i18n";
import { colors, radius, shadow, spacing } from "../theme";
import { typography } from "../typography";
import { hasGoogleMapsPlatformApiKey } from "./googleMaps";
import {
  advanceMapFitState,
  createMapFitSignature,
  initialMapFitState,
} from "./mapFit";

const fallbackMapImage = require("../../assets/map/arriving-map.png");
const truckTopImage = require("../../assets/map/truck-top.png");
// Density-qualified 30 × 58 image: native markers do not accept Image styles.
const truckMarkerImage = require("../../assets/map/truck-marker.png");
// Density-qualified 44 × 54 pins with the shadow baked in. Native markers get
// them through `image`, so Android never snapshots (and clips) a styled View.
const pickupPinImage = require("../../assets/map/pin-pickup.png");
const dropoffPinImage = require("../../assets/map/pin-dropoff.png");
// The pin tip sits at y = 45 of the 54 pt image.
const pinAnchor = { x: 0.5, y: 45 / 54 };
// Front axle of the 30 × 58 top-down truck (heading 0 = image pointing up).
const TRUCK_CAB_ANCHOR = { x: 0.5, y: 0.22 };

type ReactNativeMapsModule = typeof import("react-native-maps");

type LoadState =
  | { status: "missing_key" }
  | { status: "unsupported_platform" }
  | { status: "loading" }
  | { status: "ready"; maps: ReactNativeMapsModule }
  | { status: "unavailable" };

export type MapSurfaceProps = {
  style?: StyleProp<ViewStyle>;
  center: Coordinates;
  zoomLevel?: number;
  pitch?: number;
  onCameraSettled?: (center: Coordinates) => void;
  pickup?: MapPlace | null;
  dropoff?: MapPlace | null;
  truckCoordinate?: Coordinates | null;
  truckHeadingDegrees?: number;
  currentLocation?: Coordinates | null;
  routeCoordinates?: Coordinates[];
  fitCoordinates?: Coordinates[];
  fitPadding?: { top: number; right: number; bottom: number; left: number };
  etaMinutes?: number | null;
  showFallbackCard?: boolean;
  showFallbackReason?: boolean;
  showFallbackTracking?: boolean;
  /** False replaces all illustrative fallback geometry with a localized message. */
  showIllustrativeFallback?: boolean;
};

type GoogleMarkerProps = {
  maps: ReactNativeMapsModule;
  coordinate: Coordinates | null | undefined;
  children: ReactElement;
  anchor?: { x: number; y: number };
};

type TowRouteOverlayProps = {
  maps: ReactNativeMapsModule;
  routeCoordinates: Coordinates[];
};

function toLatLng(coordinates: Coordinates) {
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  };
}

function getFallbackReason(loadState: LoadState) {
  switch (loadState.status) {
    case "missing_key":
      return uiText("mapMissingKey");
    case "unsupported_platform":
      return uiText("mapConfiguredForMobile");
    case "loading":
      return uiText("mapLoading");
    case "unavailable":
      return uiText("mapUnavailable");
    case "ready":
      return "";
    default:
      return "";
  }
}

export function PickupMarker() {
  return (
    <Image
      accessibilityElementsHidden
      importantForAccessibility="no"
      source={pickupPinImage}
      style={styles.pin}
      testID="map-pin-pickup"
    />
  );
}

export function DropoffMarker() {
  return (
    <Image
      accessibilityElementsHidden
      importantForAccessibility="no"
      source={dropoffPinImage}
      style={styles.pin}
      testID="map-pin-dropoff"
    />
  );
}

export function TruckMarker() {
  return (
    <View style={styles.truckMarker}>
      <Image
        accessibilityElementsHidden
        importantForAccessibility="no"
        resizeMode="contain"
        source={truckTopImage}
        style={styles.truckMarkerImage}
      />
      <View style={styles.truckMarkerShadow} />
    </View>
  );
}

export function CurrentLocationMarker() {
  return (
    <View style={styles.currentLocationOuter}>
      <View style={styles.currentLocationInner} />
    </View>
  );
}

export function EtaBubble({ minutes }: { minutes: number }) {
  return (
    <View style={styles.etaBubble}>
      <Text numberOfLines={1} style={styles.etaText}>
        {formatDurationMinutes(minutes)}
      </Text>
    </View>
  );
}

export function TowRouteOverlay({
  maps,
  routeCoordinates,
}: TowRouteOverlayProps) {
  const Polyline = maps.Polyline;

  // Always mounted (empty when there is no route): inserting the polyline
  // later as the map's first child shifts the native marker indices on iOS
  // (Fabric + Google) and the pickup pin vanished when the route arrived.
  return (
    <Polyline
      coordinates={
        routeCoordinates.length >= 2 ? routeCoordinates.map(toLatLng) : []
      }
      lineCap="round"
      lineJoin="round"
      strokeColor={colors.brand.primary}
      // iOS Google polylines seed `spans` with a nil colour at init, and spans
      // win over strokeColor; strokeColors rebuilds them (ignored on Android).
      strokeColors={[colors.brand.primary]}
      strokeWidth={5}
    />
  );
}

function GoogleMarker({
  maps,
  coordinate,
  children,
  anchor,
}: GoogleMarkerProps) {
  if (!coordinate) {
    return null;
  }

  const Marker = maps.Marker;

  return (
    <Marker
      anchor={anchor ?? { x: 0.5, y: 0.5 }}
      coordinate={toLatLng(coordinate)}
    >
      {children}
    </Marker>
  );
}

type PinVariant = "pickup" | "dropoff";

function PinMarker({
  maps,
  coordinate,
  variant,
}: {
  maps: ReactNativeMapsModule;
  coordinate: Coordinates;
  variant: PinVariant;
}) {
  const Marker = maps.Marker;

  const source = variant === "pickup" ? pickupPinImage : dropoffPinImage;

  // Android: `image` avoids custom-view snapshot clipping. iOS Google: `icon`
  // sets GMSMarker.icon directly, unlike `image` (an async iconView) or child
  // views, both of which intermittently never appeared.
  return (
    <Marker
      anchor={pinAnchor}
      coordinate={toLatLng(coordinate)}
      {...(Platform.OS === "android" ? { image: source } : { icon: source })}
      zIndex={1}
    />
  );
}

function GoogleMap({
  center,
  zoomLevel,
  pitch,
  pickup,
  dropoff,
  truckCoordinate,
  truckHeadingDegrees = 0,
  currentLocation,
  routeCoordinates,
  fitCoordinates,
  fitPadding,
  etaMinutes,
  onCameraSettled,
  maps,
}: Required<Pick<MapSurfaceProps, "center" | "zoomLevel" | "pitch">> &
  Omit<
    MapSurfaceProps,
    | "style"
    | "showFallbackCard"
    | "showFallbackReason"
    | "showFallbackTracking"
  > & {
    maps: ReactNativeMapsModule;
  }) {
  const MapView = maps.default;
  const Marker = maps.Marker;
  const provider = maps.PROVIDER_GOOGLE;
  const mapRef = useRef<InstanceType<typeof MapView> | null>(null);
  const mapFitState = useRef(initialMapFitState);
  const [isMapReady, setIsMapReady] = useState(false);
  const [layoutSize, setLayoutSize] = useState({ width: 0, height: 0 });
  const fitSignature = createMapFitSignature(fitCoordinates, fitPadding);

  useEffect(() => {
    const transition = advanceMapFitState(mapFitState.current, {
      fitSignature,
      isMapReady,
      layoutWidth: layoutSize.width,
      layoutHeight: layoutSize.height,
    });
    mapFitState.current = transition.state;

    if (transition.shouldFit && fitCoordinates) {
      mapRef.current?.fitToCoordinates(fitCoordinates.map(toLatLng), {
        edgePadding: fitPadding ?? { top: 0, right: 0, bottom: 0, left: 0 },
        animated: false,
      });
    }
  }, [fitCoordinates, fitPadding, fitSignature, isMapReady, layoutSize]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setLayoutSize((current) =>
      current.height === height && current.width === width
        ? current
        : { height, width },
    );
  };

  return (
    <MapView
      camera={
        fitSignature
          ? undefined
          : {
              altitude: 0,
              center: toLatLng(center),
              heading: 0,
              pitch,
              zoom: zoomLevel,
            }
      }
      initialCamera={{
        altitude: 0,
        center: toLatLng(center),
        heading: 0,
        pitch,
        zoom: zoomLevel,
      }}
      // Show tiles as they arrive. Android's loading overlay waits for the
      // entire map to load and can obscure usable tiles on slow connections.
      loadingEnabled={false}
      onLayout={handleLayout}
      onMapReady={() => setIsMapReady(true)}
      onRegionChangeComplete={(region) => {
        onCameraSettled?.({
          latitude: region.latitude,
          longitude: region.longitude,
        });
      }}
      provider={provider}
      ref={mapRef}
      rotateEnabled={false}
      showsCompass={false}
      showsMyLocationButton={false}
      showsUserLocation={Boolean(currentLocation)}
      style={StyleSheet.absoluteFill}
      toolbarEnabled={false}
    >
      <TowRouteOverlay maps={maps} routeCoordinates={routeCoordinates ?? []} />
      {/* Pins are native marker icons; see PinMarker for the per-OS prop. */}
      {pickup?.coordinates ? (
        <PinMarker
          coordinate={pickup.coordinates}
          maps={maps}
          variant="pickup"
        />
      ) : null}
      {dropoff?.coordinates ? (
        <PinMarker
          coordinate={dropoff.coordinates}
          maps={maps}
          variant="dropoff"
        />
      ) : null}
      {truckCoordinate ? (
        <Marker
          // Pivot on the cab, not the image centre: the trimmed route starts at
          // this point, so a centred anchor hid the road ahead under the body
          // and swung the rear across buildings at corners.
          anchor={TRUCK_CAB_ANCHOR}
          coordinate={toLatLng(truckCoordinate)}
          flat
          image={truckMarkerImage}
          rotation={truckHeadingDegrees}
          zIndex={2}
        />
      ) : null}
      {typeof etaMinutes === "number" ? (
        <GoogleMarker
          // Remount on change so Android re-measures the marker bitmap.
          key={`eta-${Math.round(etaMinutes)}`}
          maps={maps}
          coordinate={truckCoordinate}
          anchor={{ x: 0.5, y: 1.6 }}
        >
          {/* Fixed-size, padded frame: Android sizes the marker snapshot from
              the first layout, which clipped the label and its shadow. */}
          <View collapsable={false} style={styles.etaMarkerFrame}>
            <EtaBubble minutes={etaMinutes} />
          </View>
        </GoogleMarker>
      ) : null}
    </MapView>
  );
}

function FallbackMap({
  pickup,
  dropoff,
  etaMinutes,
  currentLocation,
  reason,
  routeCoordinates,
  showCard,
  showReason,
  showFallbackTracking,
  truckCoordinate,
}: Pick<
  MapSurfaceProps,
  | "currentLocation"
  | "dropoff"
  | "etaMinutes"
  | "pickup"
  | "routeCoordinates"
  | "truckCoordinate"
> & {
  reason: string;
  showCard: boolean;
  showReason: boolean;
  showFallbackTracking: boolean;
}) {
  return (
    <View style={styles.fallback}>
      <Image
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        resizeMode="cover"
        source={fallbackMapImage}
        style={styles.fallbackMapImage}
      />
      {showFallbackTracking &&
      routeCoordinates &&
      routeCoordinates.length >= 2 ? (
        <View style={styles.routePreview} />
      ) : null}
      {pickup ? (
        <View style={[styles.fallbackMarker, styles.fallbackPickup]}>
          <PickupMarker />
        </View>
      ) : null}
      {dropoff ? (
        <View style={[styles.fallbackMarker, styles.fallbackDropoff]}>
          <DropoffMarker />
        </View>
      ) : null}
      {showFallbackTracking && truckCoordinate ? (
        <View style={[styles.fallbackMarker, styles.fallbackTruck]}>
          {typeof etaMinutes === "number" ? (
            <EtaBubble minutes={etaMinutes} />
          ) : null}
          <TruckMarker />
        </View>
      ) : null}
      {currentLocation ? (
        <View style={[styles.fallbackMarker, styles.fallbackCurrentLocation]}>
          <CurrentLocationMarker />
        </View>
      ) : null}
      {showCard ? (
        <View style={styles.fallbackCard}>
          <Text style={styles.fallbackTitle}>{uiText("mapServiceArea")}</Text>
          <Text style={styles.fallbackCopy}>
            {pickup?.label ?? uiText("mapPickup")} {" "}
            {uiText("mapRouteSeparator")} {" "}
            {dropoff?.label ?? uiText("mapDropoff")}
          </Text>
          {showReason ? <Text style={styles.fallbackReason}>{reason}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

export function MapSurface({
  style,
  center,
  zoomLevel = 14,
  pitch = 0,
  pickup = null,
  dropoff = null,
  truckCoordinate = null,
  truckHeadingDegrees = 0,
  currentLocation = null,
  routeCoordinates = [],
  fitCoordinates,
  fitPadding,
  etaMinutes = null,
  onCameraSettled,
  showFallbackCard = true,
  showFallbackReason = true,
  showFallbackTracking = true,
  showIllustrativeFallback = true,
}: MapSurfaceProps) {
  const [loadState, setLoadState] = useState<LoadState>(() => {
    if (Platform.OS === "web") {
      return { status: "unsupported_platform" };
    }

    if (!hasGoogleMapsPlatformApiKey) {
      return { status: "missing_key" };
    }

    return { status: "loading" };
  });

  useEffect(() => {
    let isMounted = true;

    if (Platform.OS === "web" || !hasGoogleMapsPlatformApiKey) {
      return;
    }

    async function loadGoogleMaps() {
      try {
        const maps = await import("react-native-maps");

        if (isMounted) {
          setLoadState({ status: "ready", maps });
        }
      } catch (error) {
        console.warn("[map] Google Maps failed to load", error);
        if (isMounted) {
          setLoadState({ status: "unavailable" });
        }
      }
    }

    void loadGoogleMaps();

    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackReason = useMemo(
    () => getFallbackReason(loadState),
    [loadState],
  );

  return (
    <View style={[styles.container, style]}>
      {loadState.status === "ready" ? (
        <GoogleMap
          center={center}
          currentLocation={currentLocation}
          dropoff={dropoff}
          etaMinutes={etaMinutes}
          fitCoordinates={fitCoordinates}
          fitPadding={fitPadding}
          maps={loadState.maps}
          onCameraSettled={onCameraSettled}
          pickup={pickup}
          pitch={pitch}
          routeCoordinates={routeCoordinates}
          truckCoordinate={truckCoordinate}
          truckHeadingDegrees={truckHeadingDegrees}
          zoomLevel={zoomLevel}
        />
      ) : !showIllustrativeFallback ? (
        <View
          accessibilityLiveRegion="polite"
          style={[styles.unavailableMessage, { top: (fitPadding?.top ?? 0) + spacing.lg }]}
        >
          <Text style={styles.fallbackTitle}>{uiText("mapDisplayUnavailable")}</Text>
        </View>
      ) : (
        <FallbackMap
          dropoff={dropoff}
          etaMinutes={etaMinutes}
          currentLocation={currentLocation}
          pickup={pickup}
          reason={fallbackReason}
          routeCoordinates={routeCoordinates}
          showCard={showFallbackCard}
          showReason={showFallbackReason}
          showFallbackTracking={showFallbackTracking}
          truckCoordinate={truckCoordinate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface.muted,
    flex: 1,
    overflow: "hidden",
  },
  fallback: {
    flex: 1,
    overflow: "hidden",
  },
  unavailableMessage: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface.base,
    borderRadius: radius.md,
  },
  fallbackMapImage: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
  },
  routePreview: {
    borderColor: colors.brand.primary,
    borderLeftWidth: 6,
    borderRadius: radius.pill,
    borderTopWidth: 6,
    height: "42%",
    left: "28%",
    position: "absolute",
    top: "25%",
    transform: [{ rotate: "-12deg" }],
    width: "48%",
  },
  fallbackMarker: {
    alignItems: "center",
    position: "absolute",
  },
  fallbackPickup: {
    left: "24%",
    top: "22%",
  },
  fallbackDropoff: {
    right: "24%",
    top: "58%",
  },
  fallbackTruck: {
    gap: spacing.xs,
    left: "55%",
    top: "36%",
  },
  fallbackCurrentLocation: {
    left: "42%",
    top: "30%",
  },
  currentLocationOuter: {
    alignItems: "center",
    backgroundColor: "rgba(37, 99, 235, 0.18)",
    borderColor: colors.surface.base,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  currentLocationInner: {
    backgroundColor: "#2563EB",
    borderColor: colors.surface.base,
    borderRadius: radius.pill,
    borderWidth: 3,
    height: 18,
    width: 18,
  },
  pin: {
    height: 54,
    width: 44,
  },

  truckMarker: {
    alignItems: "center",
    height: 64,
    justifyContent: "center",
    width: 46,
  },
  truckMarkerImage: {
    height: 58,
    width: 30,
    zIndex: 1,
  },
  truckMarkerShadow: {
    backgroundColor: "rgba(62, 73, 88, 0.24)",
    borderRadius: radius.pill,
    height: 4,
    marginTop: -3,
    width: 34,
  },
  etaMarkerFrame: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 96,
  },
  etaBubble: {
    alignItems: "center",
    backgroundColor: colors.surface.base,
    borderRadius: radius.pill,
    minWidth: 64,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    ...shadow.card,
  },
  etaText: {
    ...typography.caption,
    color: colors.text.primary,
    textAlign: "center",
  },
  fallbackCard: {
    backgroundColor: colors.surface.base,
    borderRadius: radius.md,
    bottom: spacing.xl,
    left: spacing.lg,
    maxWidth: 260,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    position: "absolute",
    ...shadow.card,
  },
  fallbackTitle: {
    ...typography.bodyStrong,
    color: colors.text.primary,
  },
  fallbackCopy: {
    ...typography.bodySmall,
    color: colors.text.muted,
    marginTop: spacing.xxs,
  },
  fallbackReason: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: spacing.sm,
  },
});
