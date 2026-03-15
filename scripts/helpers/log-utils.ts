/* oxlint-disable jsdoc/require-param-type -- TypeScript type annotations are sufficient */
/**
 * Logging helper functions.
 * Provides a unified log format for lint scripts.
 */

/**
 * Print a success message.
 * @param message The message to print
 */
export const logSuccess = (message: string): void => {
  console.log(`✅ ${message}`);
};

/**
 * Print an error message.
 * @param message The message to print
 * @param addNewLine Whether to prepend a newline (default: true)
 */
export const logError = (message: string, addNewLine = true): void => {
  const prefix = addNewLine ? "\n❌" : "❌";
  console.error(`${prefix} ${message}`);
};

/**
 * Print a fatal error message with optional error details.
 * @param message The message to print
 * @param error An optional error object
 */
export const logFatalError = (message: string, error?: unknown): void => {
  console.error(`❌ ${message}`, error || "");
};

/**
 * Print an informational message.
 * @param message The message to print
 */
export const logInfo = (message: string): void => {
  console.log(`📊 ${message}`);
};

/**
 * Print a warning message.
 * @param message The message to print
 */
export const logWarning = (message: string): void => {
  console.log(`⚠️ ${message}`);
};

/**
 * Print a plain message without an icon.
 * @param message The message to print
 */
export const log = (message: string): void => {
  console.log(message);
};
