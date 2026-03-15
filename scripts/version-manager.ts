import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";

import { logError, logSuccess } from "./helpers/log-utils";

// ANSI color helpers
const bold = (s: string) => `\u001B[1m${s}\u001B[0m`;
const dim = (s: string) => `\u001B[2m${s}\u001B[0m`;
const cyan = (s: string) => `\u001B[36m${s}\u001B[0m`;
const green = (s: string) => `\u001B[32m${s}\u001B[0m`;
const yellow = (s: string) => `\u001B[33m${s}\u001B[0m`;
const magenta = (s: string) => `\u001B[35m${s}\u001B[0m`;

// oxlint-disable-next-line unicorn/prefer-module
const appConfigPath = path.resolve(__dirname, "../app.config.ts");
// oxlint-disable-next-line unicorn/prefer-module
const packageJsonPath = path.resolve(__dirname, "../package.json");

const rl = createInterface({ input: process.stdin, output: process.stdout });

/**
 * Prompt the user for input via readline.
 */
const ask = async (question: string): Promise<string> => {
  const answer = await rl.question(question);
  return answer.trim();
};

interface VersionInfo {
  appVersion: string;
  packageVersion: string;
  iosBuildNumber: string;
}

/**
 * Read current version information from app.config.ts and package.json.
 */
const readVersionInfo = (): VersionInfo => {
  const appConfigContent = fs.readFileSync(appConfigPath, "utf8");
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonContent);

  const versionMatch = appConfigContent.match(/const APP_VERSION = "(.*)";/);
  const buildNumberMatch = appConfigContent.match(
    /const IOS_BUILD_NUMBER = "(.*)";/
  );

  if (!versionMatch) {
    logError("Could not find APP_VERSION in app.config.ts");
    process.exit(1);
  }

  if (!buildNumberMatch) {
    logError("Could not find IOS_BUILD_NUMBER in app.config.ts");
    process.exit(1);
  }

  return {
    appVersion: versionMatch[1],
    iosBuildNumber: buildNumberMatch[1],
    packageVersion: packageJson.version,
  };
};

/**
 * Display current version information.
 */
const displayVersionInfo = (info: VersionInfo): void => {
  console.log(`\n${bold("📦 Version Information:")}`);
  console.log(
    `   App Version ${dim("(app.config.ts)")}:  ${cyan(info.appVersion)}`
  );
  console.log(
    `   Package Version ${dim("(package.json)")}: ${cyan(info.packageVersion)}`
  );
  console.log(
    `   iOS Build Number:             ${magenta(info.iosBuildNumber)}\n`
  );

  if (info.appVersion !== info.packageVersion) {
    console.log(
      yellow(
        `⚠️ Version mismatch: app.config.ts (${info.appVersion}) != package.json (${info.packageVersion})\n`
      )
    );
  }
};

/**
 * Compute bumped version string from current semver.
 */
const bumpVersion = (
  current: string,
  type: "major" | "minor" | "patch"
): string => {
  const parts = current.split(".").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    logError(`Invalid semver format: ${current}`);
    process.exit(1);
  }

  const [major, minor, patch] = parts;
  switch (type) {
    case "major": {
      return `${major + 1}.0.0`;
    }
    case "minor": {
      return `${major}.${minor + 1}.0`;
    }
    case "patch": {
      return `${major}.${minor}.${patch + 1}`;
    }
    default: {
      return current;
    }
  }
};

/**
 * Update version in app.config.ts and package.json.
 */
const updateVersion = (version: string): void => {
  // Update app.config.ts
  let appConfigContent = fs.readFileSync(appConfigPath, "utf8");
  const versionRegex = /const APP_VERSION = ".*";/;
  if (!versionRegex.test(appConfigContent)) {
    logError("Could not find APP_VERSION in app.config.ts");
    process.exit(1);
  }
  appConfigContent = appConfigContent.replace(
    versionRegex,
    `const APP_VERSION = "${version}";`
  );
  fs.writeFileSync(appConfigPath, appConfigContent);

  // Update package.json
  const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonContent);
  packageJson.version = version;
  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`
  );

  logSuccess(`Updated version to ${version}`);
};

/**
 * Update iOS build number in app.config.ts.
 */
const updateBuildNumber = (buildNumber: string): void => {
  let appConfigContent = fs.readFileSync(appConfigPath, "utf8");
  const buildNumberRegex = /const IOS_BUILD_NUMBER = ".*";/;
  if (!buildNumberRegex.test(appConfigContent)) {
    logError("Could not find IOS_BUILD_NUMBER in app.config.ts");
    process.exit(1);
  }
  appConfigContent = appConfigContent.replace(
    buildNumberRegex,
    `const IOS_BUILD_NUMBER = "${buildNumber}";`
  );
  fs.writeFileSync(appConfigPath, appConfigContent);

  logSuccess(`Updated build number to ${buildNumber}`);
};

// --- Main ---

const main = async () => {
  const info = readVersionInfo();
  displayVersionInfo(info);

  // Version update prompt
  console.log(bold("Update version?"));
  console.log(
    `   ${green("1")} - major ${dim(`(→ ${bumpVersion(info.appVersion, "major")})`)}`
  );
  console.log(
    `   ${green("2")} - minor ${dim(`(→ ${bumpVersion(info.appVersion, "minor")})`)}`
  );
  console.log(
    `   ${green("3")} - patch ${dim(`(→ ${bumpVersion(info.appVersion, "patch")})`)}`
  );
  console.log(`   ${green("4")} - custom`);
  console.log(`   ${dim("Enter - skip")}`);
  const versionChoice = await ask("> ");

  if (versionChoice) {
    let newVersion: string | undefined;
    switch (versionChoice) {
      case "1": {
        newVersion = bumpVersion(info.appVersion, "major");
        break;
      }
      case "2": {
        newVersion = bumpVersion(info.appVersion, "minor");
        break;
      }
      case "3": {
        newVersion = bumpVersion(info.appVersion, "patch");
        break;
      }
      case "4": {
        newVersion =
          (await ask(`${bold("New version")} ${dim("(e.g. 1.2.3)")}: `)) ||
          undefined;
        break;
      }
      default: {
        console.log(dim("⏭️  Skipped version update.\n"));
      }
    }

    if (newVersion) {
      updateVersion(newVersion);
    }
  } else {
    console.log(dim("⏭️  Skipped version update.\n"));
  }

  // Build number update prompt
  const currentBuildNumber = Number(info.iosBuildNumber);
  const suggestedBuildNumber = Number.isNaN(currentBuildNumber)
    ? ""
    : String(currentBuildNumber + 1);

  console.log(bold("Update build number?"));
  if (suggestedBuildNumber) {
    console.log(
      `   ${green("+")} - increment ${dim(`(→ ${suggestedBuildNumber})`)}`
    );
  }
  console.log(`   ${dim("Enter - skip / or enter a custom value")}`);
  const buildChoice = await ask("> ");

  if (buildChoice) {
    const newBuildNumber =
      buildChoice === "+" ? suggestedBuildNumber : buildChoice;
    if (newBuildNumber) {
      updateBuildNumber(newBuildNumber);
    }
  } else {
    console.log(dim("⏭️  Skipped build number update.\n"));
  }

  // Show final state
  const finalInfo = readVersionInfo();
  displayVersionInfo(finalInfo);
};

try {
  await main();
} catch (error: unknown) {
  logError(`Version manager failed: ${error}`);
  process.exit(1);
} finally {
  rl.close();
}
