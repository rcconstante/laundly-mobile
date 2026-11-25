# Laundly Mobile

![Laundly logo](assets/brand/laundly-logo.webp)

Expo and React Native preview for laundry shop owners, clients, and riders.

## Local development

```sh
npm ci
npm start
```

Run `npm run android` or `npm run ios` to open a native target. Run `npm run web` for a browser preview.

Select a role on the welcome screen and choose **Explore the demo** to open its workspace. Select **Log in** or **Sign up** to open the corresponding Manke-style screen and try it with sample details. The Manke login and signup forms use local validation in this preview. The role pages are blank with a shared Laundly header and floating navigation. The **Terms and Conditions** link temporarily points to [the Laundly website](https://laundly.vercel.app/).

| Role | Tabs |
| --- | --- |
| Owner | Home, Orders, Machines, Reports, More |
| Client | Home, Orders, Book, Inbox, Profile |
| Rider | Home, Tasks, Map, Cash, Profile |

## Project layout

- `src/app/` contains Expo Router routes.
- `src/features/auth/` contains onboarding and the preview forms.
- `src/features/workspace/` contains role navigation, and the shared workspace shell.
- `src/shared/` contains reusable brand and legal components.
- `src/theme.ts` holds shared colors and shadows.
- `assets/brand/` holds the launcher icon and WebP artwork.

Run `npm run lint` and `npm run typecheck` to check changes.
