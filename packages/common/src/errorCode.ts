// Define error codes as string literals
export const ERROR_CODES = {
  INVALID_FLOOR_LEVEL: "INVALID_FLOOR_LEVEL",
  INVALID_BUILDING_CODE: "INVALID_BUILDING_CODE",
  NO_DEFAULT_FLOOR: "NO_DEFAULT_FLOOR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

// Create type from object keys
export type ErrorCode = keyof typeof ERROR_CODES;

// Define error messages using the same keys
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  INVALID_FLOOR_LEVEL: "The floor level is invalid!",
  INVALID_BUILDING_CODE: "The building code is invalid!",
  NO_DEFAULT_FLOOR: "This building has no default floor!",
  UNKNOWN_ERROR: "An unknown error occurred!",
};

/**
 * Function to get error message from code
 * @param code - The error code
 * @returns The error message
 * @note This function is used to display error messages to the user,
 * so it should be safe to display the code if the code is not in the ERROR_MESSAGES
 * which is possible since we do type coerce the error code
 */
export function getErrorMessage(code: ErrorCode): string {
  if (code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[code];
  }
  return code;
}
