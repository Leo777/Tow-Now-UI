import Constants from "expo-constants";
import { Platform } from "react-native";

const PLACEHOLDER_VALUES = new Set([
  "",
  "YOUR_GOOGLE_MAPS_ANDROID_API_KEY",
  "YOUR_GOOGLE_MAPS_IOS_API_KEY",
]);

type NativeGoogleMapsConfig = {
  android?: {
    config?: {
      googleMaps?: {
        apiKey?: string;
      };
    };
  };
  ios?: {
    config?: {
      googleMapsApiKey?: string;
    };
  };
};

const nativeConfig = Constants.expoConfig as NativeGoogleMapsConfig | null;

export const googleMapsAndroidApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY?.trim() ??
  nativeConfig?.android?.config?.googleMaps?.apiKey?.trim() ??
  "";
export const googleMapsIosApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY?.trim() ??
  nativeConfig?.ios?.config?.googleMapsApiKey?.trim() ??
  "";

export const googleMapsPlatformApiKey =
  Platform.OS === "android"
    ? googleMapsAndroidApiKey
    : Platform.OS === "ios"
      ? googleMapsIosApiKey
      : "";

export const hasGoogleMapsPlatformApiKey = !PLACEHOLDER_VALUES.has(
  googleMapsPlatformApiKey,
);
