# Challenge

## Features

- Documents in list and grid views.
- Sorting by date, version or title, plus pull-to-refresh.
- Local document creation with native file picker and AsyncStorage persistence.
- Realtime WebSocket notifications, unread badge and notification history.
- Local notifications through Notifee, native sharing and relative dates.
- Safe rendering of missing or nullable backend fields.

## Run locally

Requirements: Node.js 22.13+
backend running on `localhost:8080`.

```sh
npm install
```

### iOS

```sh
bundle install
cd ios && bundle exec pod install && cd ..
npm run ios
```

### Android

Start an emulator or connect a device, then expose the backend port before launching the app:

```sh
npm run android:reverse
npm run android
```

Both the HTTP API and WebSocket use `localhost:8080`. This avoids committing a machine-specific IP and works with the iOS Simulator and Android through `adb reverse`.

## Quality checks

```sh
npm test -- --runInBand
npm run lint
npx tsc --noEmit
```

The test suite covers DTO validation, reducers, hooks, services, providers, component rendering and the complete documents screen.

## Technical approach

- Feature-based UI and state, with shared screens, services and theme constants.
- Reducer-backed providers offer a small Redux-like API without adding Redux.
- Network, realtime, storage and local notifications are behind replaceable service interfaces.
- Backend and WebSocket payloads are validated at their boundaries without an additional schema library.
- Notifee was chosen for its straightforward cross-platform local notification API.
- date-fns handles date parsing, comparison and relative formatting instead of reimplementing date logic.
- Local notifications reuse one silent notification to avoid spamming users when the sample WebSocket emits frequently.
