# Laundly Mobile

![Laundly logo](assets/brand/laundly-icon.webp)

Expo and React Native preview for laundry shop owners, clients, and riders.

## Local development

```sh
npm ci
npm start
```

Run `npm run android` or `npm run ios` to open a native target. Run `npm run web` for a browser preview.

Select a role on the welcome screen and choose **Explore the demo** to open its workspace. Choose **Get started** to switch between login and signup. Use sample details for both forms. The Manke login and signup forms use local validation in this preview. The role pages are blank with a shared Laundly header and floating navigation. The app links to [Privacy Policy](https://laundly.vercel.app/privacy) and [Terms and Conditions](https://laundly.vercel.app/terms) on the Laundly website.

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
