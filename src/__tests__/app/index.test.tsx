import { describe, expect, test } from "bun:test";

import { render } from "@testing-library/react-native";

import HomeScreen from "@/app/index";

describe("HomeScreen", () => {
  test("renders 'Expo Boilerplate' text", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText("Expo Boilerplate")).toBeTruthy();
  });
});
