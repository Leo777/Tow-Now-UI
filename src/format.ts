export const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  currency: "PLN",
  maximumFractionDigits: 0,
  style: "currency",
});

export function formatPLN(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatPolishPhone(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "");
  const withoutCountryCode = digits.startsWith("48")
    ? digits.slice(2)
    : digits;
  const groups = withoutCountryCode.match(/.{1,3}/g)?.join(" ") ?? "";

  return groups ? `+48 ${groups}` : "+48";
}

// Hermes on iOS maps `style: "unit"` to NSMeasurementFormatter, which converts
// units ("9 min" renders as "540s") and ignores fraction digits. Format the
// number with Intl and append the abbreviation ourselves.
export function formatDistanceKm(distanceKm: number) {
  const value = new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: distanceKm < 10 ? 1 : 0,
    minimumFractionDigits: 0,
  }).format(distanceKm);

  return `${value} km`;
}

export function formatDurationMinutes(minutes: number) {
  return `${Math.max(1, Math.round(minutes))} min`;
}

export function formatClockTime(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Warsaw",
  }).format(date);
}
