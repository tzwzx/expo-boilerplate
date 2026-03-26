/* oxlint-disable promise/prefer-await-to-then -- Test mocks heavily use Promise.resolve() */
import { mock } from "bun:test";
import { URL as NodeURL } from "node:url";

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import React from "react";

// 1. Fully mock modules first to prevent access to actual implementations
mock.module("react-native", () => ({
  Platform: {
    OS: "ios",
    Version: "13.0",
    select: (objs: Record<string, unknown>) => objs.ios || objs.default,
  },
  StyleSheet: { create: (s: unknown) => s, flatten: (s: unknown) => s },
  Text: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
    React.createElement("Text", props, children),
  View: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) =>
    React.createElement("View", props, children),
  useColorScheme: () => "light",
}));

// Expo global mock
// @ts-expect-error No type definitions for the Expo global object
globalThis.expo = {
  EventEmitter: class {
    addListener = mock(() => ({ remove: mock() }));
    removeAllListeners = mock();
    removeListener = mock();
    listenerCount = mock(() => 0);
    emit = mock();
  },
};

// Register happy-dom globals
GlobalRegistrator.register();

// Suppress the react-test-renderer deprecation warning used internally by @testing-library/react-native
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("react-test-renderer is deprecated")) {
    return;
  }
  originalConsoleError(...args);
};

// Global mocks
// @ts-expect-error __DEV__ from react-native does not exist in Node environment
global.__DEV__ = true;
globalThis.URL = NodeURL as typeof globalThis.URL;
process.env.EXPO_OS = "ios";

// Module mocks
mock.module("expo-router", () => ({
  Link: "Link",
  Stack: Object.assign(
    mock(() => null),
    { Screen: mock(() => null) },
  ),
  Tabs: Object.assign(
    mock(() => null),
    { Screen: mock(() => null) },
  ),
  router: {
    back: mock(),
    push: mock(),
    replace: mock(),
    setParams: mock(),
  },
  useLocalSearchParams: mock(() => ({})),
  usePathname: mock(() => "/"),
  useRouter: mock(() => ({
    back: mock(),
    push: mock(),
    replace: mock(),
    setParams: mock(),
  })),
  useSegments: mock(() => []),
}));

mock.module("@react-navigation/native", () => ({
  DarkTheme: {
    colors: {
      background: "rgb(1, 1, 1)",
      border: "rgb(39, 39, 41)",
      card: "rgb(18, 18, 18)",
      notification: "rgb(255, 69, 58)",
      primary: "rgb(10, 132, 255)",
      text: "rgb(229, 229, 231)",
    },
    dark: true,
  },
  DefaultTheme: {
    colors: {
      background: "rgb(242, 242, 242)",
      border: "rgb(216, 216, 216)",
      card: "rgb(255, 255, 255)",
      notification: "rgb(255, 59, 48)",
      primary: "rgb(0, 122, 255)",
      text: "rgb(28, 28, 30)",
    },
    dark: false,
  },
  ThemeProvider: ({ children }: { children: unknown }) => children,
}));

mock.module("expo-status-bar", () => ({
  StatusBar: "StatusBar",
}));

mock.module("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      name: "Expo Boilerplate",
    },
  },
}));

mock.module("react-native-gesture-handler", () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
}));

mock.module("react-native-reanimated", () => ({
  __esModule: true,
  default: {
    View: "Animated.View",
  },
}));

mock.module("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({
    children,
    ...props
  }: { children?: React.ReactNode } & Record<string, unknown>) =>
    React.createElement("SafeAreaView", props, children),
  useSafeAreaInsets: mock(() => ({ bottom: 0, left: 0, right: 0, top: 0 })),
}));
