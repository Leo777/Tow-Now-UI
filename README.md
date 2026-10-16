# Tow Now UI

Shared theme, base components and map for the Tow Now customer
(`Tow-Now-Client-App`) and driver (`Tow-Now-Driver-App`) apps.

## Contents

- `theme`, `typography`: the palette, spacing, radii, shadows and text styles from Figma.
- Components: `Button`, `TextField`, `IconButton`, `ListRow`, `BackArrowIcon`,
  `ScreenHeader`, `BottomSheet`, `ChoiceChip`.
- Map: `MapSurface` (Google Maps with the Figma pins, brand-colour route and
  the cab-anchored truck marker), marker components and the map-fit helpers.
- Formatting: `formatPLN`, `formatDistanceKm`, `formatDurationMinutes`,
  `formatClockTime`, `formatPolishPhone`.
- `setUiLocale("pl" | "en")`: the language of the few strings shared
  components render themselves (map fallbacks, the back button label).

The package ships TypeScript source; Metro and `jest-expo` compile it.

## Using it in an app

```json
"@townow/ui": "github:Leo777/Tow-Now-UI#v0.1.0"
```

Apps pin a tag. To release a change: merge it here, tag `vX.Y.Z`, then bump the
tag in each app's `package.json` and run `npm install`.

Jest must transform the package, so add `@townow/ui` to the
`transformIgnorePatterns` allow-list (see the customer app's `jest.config.cjs`).

EAS and CI need read access to this private repository to install it.

## Developing locally

```sh
npm install
npm run typecheck
npm test
```

To try unreleased changes inside an app, pack this repo and install the tarball
there without saving it:

```sh
npm pack --pack-destination /tmp
cd ../tow_now_client && npm install --no-save /tmp/townow-ui-0.1.0.tgz
```
