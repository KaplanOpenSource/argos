import { NUM_OF_DECIMAL_DIGITS } from "../constants/constants";

export default function processingDecimalDigits(decimalNumber) {
  return decimalNumber.toFixed(NUM_OF_DECIMAL_DIGITS);
}
