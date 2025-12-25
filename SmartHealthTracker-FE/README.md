# Smart Health Tracker - Frontend

A mobile health tracking application built with React Native and Expo. Track your workouts, monitor your health metrics, and stay connected with a fitness community.

## Features

- **Workout Tracking**: Live tracking with GPS location and real-time statistics
- **Health Statistics**: Monitor steps, sleep, and activity data
- **Social Features**: Connect with friends, create groups, and share progress
- **Sedentary Reminders**: Get notifications to stay active
- **Theme Support**: Light and dark mode
- **Secure Authentication**: Firebase authentication with OTP verification

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Android Studio** - For Android development
  - Android SDK
  - Android Emulator or physical device
- **Expo CLI** - Will be installed with dependencies
- **Git** - For version control

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SmartHealthTracker-FE
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   Create a `.env` file in the root directory and add the following Firebase configuration:

   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   ```

   > **Note**: Replace the placeholder values with your actual Firebase configuration.

## Running the App

### Start the Development Server

```bash
npx expo start
```

This will start the Expo development server. You'll see a QR code in the terminal.

### Run on Android

Make sure you have an Android emulator running or an Android device connected via USB with USB debugging enabled.

```bash
npx expo run:android
```

Or press `a` in the terminal after running `npx expo start`.

## Project Structure

```
app/                    # Application screens
├── (tabs)/            # Tab navigation screens
├── auth/              # Authentication screens
├── settings/          # Settings screens
├── social/            # Social features screens
└── workout/           # Workout tracking screens

components/            # Reusable UI components
├── ui/               # UI-specific components
└── ...

config/               # Configuration files
├── axios.ts         # API client setup
└── firebase.ts      # Firebase configuration

services/             # Business logic and API calls
store/               # State management (Zustand)
utils/               # Utility functions
```

## Key Technologies

- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Expo Router** - File-based routing
- **NativeWind** - Tailwind CSS for React Native
- **Zustand** - State management
- **Axios** - HTTP client
- **Firebase** - Authentication
- **React Native Maps** - Location and mapping

## API Configuration

The app connects to the backend API at:

```
https://smarthealthtracker-backend.onrender.com/api
```

This is configured in [config/axios.ts](config/axios.ts).

## Troubleshooting

### Common Issues

1. **Metro bundler issues**

   ```bash
   npx expo start -c
   ```

2. **Dependencies issues**

   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Android build issues**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

## Scripts

- `npx expo start` - Start the Expo development server

## License

This project is part of a university coursework for SE405 - Mobile & Pervasive Computing.

## Support

For issues or questions, please contact the development team.
