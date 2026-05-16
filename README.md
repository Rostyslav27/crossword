# Кросворд – React Native (Expo)

Мобільний додаток з кросвордами, побудований на React Native + Expo.

## Функції

- 🧩 Кросворди у форматі `string[][]` (тайлова сітка з буквами)
- ⚡ Система енергії з авто-поповненням кожні 2 години
- 📺 Монетизація через перегляд реклами (stub → замінити на AdMob)
- 💳 In-App Purchases: 50 ⚡ за $0.99, 200 ⚡ за $2.49 (stub → замінити на react-native-iap)
- 🔥 Щоденна синхронізація нових кросвордів із Firebase Firestore
- 💾 Локальне збереження прогресу через AsyncStorage (готово до міграції на Firebase Auth)
- ❤️ Лайки з синком на сервер
- 📁 Особиста колекція, прихування, позначення як виконаних

## Структура

```
App.tsx
src/
  types/             # ICrossword, IWord, IEnergyState, IUserCrosswordState
  data/              # 10 вбудованих кросвордів
  services/          # storage, firebase, crosswordSync, energy, ads, iap
  store/             # Zustand stores (useUserStore, useCrosswordStore)
  navigation/        # React Navigation stack
  screens/           # HomeScreen, CrosswordScreen, ShopScreen
  components/        # CrosswordGrid, Keyboard, EnergyBar, CrosswordCard, modals
```

## Запуск

```bash
npm install
npx expo start
```

## Firebase

Відредагуйте `src/services/firebase.ts` та вкажіть ваші Firebase credentials.

Структура Firestore: `crosswords/{id}` → об'єкт `ICrossword`.

## Реклама (AdMob)

Замініть stub у `src/services/ads.ts` на `react-native-google-mobile-ads`.

## Покупки (IAP)

Замініть stub у `src/services/iap.ts` на `react-native-iap`.
