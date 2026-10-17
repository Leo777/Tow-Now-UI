export type UiLocale = "en" | "pl";

const messages = {
  en: {
    back: "Back",
    mapConfiguredForMobile: "Google Maps is configured for the native mobile app.",
    mapDisplayUnavailable: "The map cannot be displayed.",
    mapDropoff: "Repair shop",
    mapLoading: "Loading Google Maps...",
    mapMissingKey: "Add the platform Google Maps SDK key to render the native map.",
    mapPickup: "Pickup",
    mapRouteSeparator: "to",
    mapServiceArea: "Krakow tow area",
    mapUnavailable: "Google Maps is unavailable in this build.",
    sheetCollapse: "Hide details",
    sheetExpand: "Show details",
  },
  pl: {
    back: "Wstecz",
    mapConfiguredForMobile: "Google Maps jest skonfigurowane dla aplikacji mobilnej.",
    mapDisplayUnavailable: "Nie można wyświetlić mapy.",
    mapDropoff: "Warsztat",
    mapLoading: "Ładowanie Google Maps...",
    mapMissingKey: "Dodaj klucz Google Maps SDK dla tej platformy, aby wyświetlić mapę.",
    mapPickup: "Miejsce odbioru",
    mapRouteSeparator: "do",
    mapServiceArea: "Obszar holowania w Krakowie",
    mapUnavailable: "Google Maps jest niedostępne w tej wersji aplikacji.",
    sheetCollapse: "Ukryj szczegóły",
    sheetExpand: "Pokaż szczegóły",
  },
} satisfies Record<UiLocale, Record<string, string>>;

export type UiMessageKey = keyof (typeof messages)["en"];

let activeLocale: UiLocale = "pl";

/** Each app picks the locale of the shared components at startup. */
export function setUiLocale(locale: UiLocale) {
  activeLocale = locale;
}

export function getUiLocale() {
  return activeLocale;
}

export function uiText(key: UiMessageKey) {
  return messages[activeLocale][key];
}
