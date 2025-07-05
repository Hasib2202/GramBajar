import mongoose from "mongoose";

export const safeConvertDecimal = (value) => {
  // Handle null/undefined
  if (value === null || value === undefined) {
    console.warn('Attempted to convert null/undefined value');
    return 0;
  }
  
  // Handle Decimal128
  if (value instanceof mongoose.Types.Decimal128) {
    return parseFloat(value.toString());
  }
  
  // Handle numbers and strings
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  
  console.error('Unsupported type for conversion:', typeof value, value);
  return 0;
};