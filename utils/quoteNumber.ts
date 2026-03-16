/**
 * Generates a unique quote number in the format: TKF-YYYY-XXXX
 * where YYYY is the current year and XXXX is a sequential number (0001, 0002, etc.)
 */
export function generateQuoteNumber(sequence: number): string {
  const year = new Date().getFullYear()
  const sequenceStr = sequence.toString().padStart(4, '0')
  return `TKF-${year}-${sequenceStr}`
}

/**
 * Extracts the sequence number from a quote number
 */
export function extractSequenceFromQuoteNumber(quoteNumber: string): number {
  const match = quoteNumber.match(/TKF-\d{4}-(\d{4})/)
  if (!match) {
    throw new Error('Invalid quote number format')
  }
  return parseInt(match[1], 10)
}
