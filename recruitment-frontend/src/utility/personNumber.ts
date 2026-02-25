import  personnummer  from "personnummer";

export function formatPersonNumber(value: string): string | null {
  if (!value) return null;

  const digits = value.replace(/\D/g, "");
  if (digits.length !== 12) return null;

  return `${digits.slice(0, 8)}-${digits.slice(8)}`;
}

export function isValidPersonNumberFormatted(value: string): boolean {
  // expects YYYYMMDD-XXXX
  return personnummer.valid(value);
}

export function validateAndFormatPNR(value: string): string | null {
  try {
    const pnr = personnummer.parse(value);
    return pnr.format(); // YYYYMMDD-XXXX
  } catch {
    return null;
  }
}