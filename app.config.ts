import type { ExpoConfig } from "expo/config";

const APP_NAME = "Expo Boilerplate";

const APP_VERSION = "0.1.0";
const IOS_BUILD_NUMBER = "1";

// oxlint-disable-next-line unicorn/no-anonymous-default-export
export default (): ExpoConfig => ({
  experiments: {
    reactCompiler: true,
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "your-project-id",
    },
  },
  icon: "./assets/images/icon.png",
  ios: {
    appleTeamId: "YOUR_TEAM_ID",
    buildNumber: IOS_BUILD_NUMBER,
    bundleIdentifier: "com.example.expo-boilerplate",
    infoPlist: {
      CFBundleDevelopmentRegion: "ja",
      CFBundleDisplayName: APP_NAME,
      CFBundleName: APP_NAME,
      ITSAppUsesNonExemptEncryption: false,
    },
    supportsTablet: false,
  },
  name: APP_NAME,
  orientation: "portrait",
  owner: "your-owner",
  platforms: ["ios"],
  plugins: [
    ["expo-dev-client", { launchMode: "most-recent" }],
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#1f2937",
        },
      },
    ],
  ],
  runtimeVersion: {
    policy: "appVersion",
  },
  scheme: "expo-boilerplate",
  slug: "expo-boilerplate",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  userInterfaceStyle: "automatic",
  version: APP_VERSION,
});
