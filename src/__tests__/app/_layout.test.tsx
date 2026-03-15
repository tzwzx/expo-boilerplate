import { describe, expect, test } from "bun:test";

import { render } from "@testing-library/react-native";

import RootLayout from "@/app/_layout";

describe("RootLayout", () => {
  test("renders without errors", () => {
    const { toJSON } = render(<RootLayout />);

    expect(toJSON()).toBeTruthy();
  });
});
