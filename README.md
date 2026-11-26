# LabaPilot Mobile

![LabaPilot logo](assets/brand/laundly-icon.webp)

Expo and React Native preview for laundry shop owners, clients, and riders.

## Run locally

```sh
npm ci
npm start
```

Use `npm run android`, `npm run ios`, or `npm run web` to select a target.

## Try the preview

- Choose **Owner**, then **Explore the demo**. Create a branch and use **Customers** and **Pricing** to add a customer and service. Create a load, advance it in **Orders**, and record payment. **Reports** and **Today’s sales** use the recorded payment date.
- Use the branch switcher to create a second location or return to the first. Each branch keeps its own machines, pricing, customers, orders, and sales.
- **Get started** opens login and signup. For password reset, use a sample email and demo code `123456`. The preview does not send email or authenticate accounts.
- Profile details, preferences, and owner data are stored on the device. Account preferences are scoped to each preview role.

| Role | Main tabs |
| --- | --- |
| Owner | Home, Orders, Machines, Reports, More |
| Client | Home, Orders, Book, Inbox, Profile |
| Rider | Home, Tasks, Map, Cash, Profile |

## Project layout

- `src/app/` contains Expo Router entry points.
- `src/entities/owner/` contains the branch model, business rules, and storage adapter.
- `src/features/` contains authentication, owner screens, profile, and workspace navigation.
- `src/shared/` contains reusable UI, brand assets, and legal links.

Run `npm run lint` and `npm run typecheck` to check changes.
