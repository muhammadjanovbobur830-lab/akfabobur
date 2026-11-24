/**
 * Formats raw input into Uzbekistan standard phone mask: +998 XX XXX XX XX
 */
export function formatUzPhone(rawInput: string): string {
  const digits = rawInput.replace(/\D/g, '');

  // Strip leading 998 if user pasted full international number
  let localDigits = digits;
  if (digits.startsWith('998')) {
    localDigits = digits.slice(3);
  } else if (digits.startsWith('8') && digits.length >= 10) {
    localDigits = digits.slice(1);
  }

  localDigits = localDigits.slice(0, 9);

  if (localDigits.length === 0) {
    return '+998 ';
  }

  const p1 = localDigits.slice(0, 2);
  const p2 = localDigits.slice(2, 5);
  const p3 = localDigits.slice(5, 7);
  const p4 = localDigits.slice(7, 9);

  let formatted = `+998 ${p1}`;
  if (p2) formatted += ` ${p2}`;
  if (p3) formatted += ` ${p3}`;
  if (p4) formatted += ` ${p4}`;

  return formatted;
}

/**
 * Extracts the 9 local digits after +998
 */
export function extractUzLocalDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('998')) {
    return digits.slice(3, 12);
  }
  return digits.slice(0, 9);
}

/**
 * Checks whether a formatted Uzbekistan phone number is complete and valid.
 * Valid format: +998 XX XXX XX XX (9 local digits, non-zero operator prefix)
 */
export function isValidUzPhone(phone: string): boolean {
  const local = extractUzLocalDigits(phone);
  if (local.length !== 9) return false;
  // Valid Uzbekistan mobile & regional operator codes start with 2-9
  const firstDigit = local[0];
  return firstDigit >= '2' && firstDigit <= '9';
}
