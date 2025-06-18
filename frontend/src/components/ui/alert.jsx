// components/ui/alert.tsx
import { AlertCircle } from "lucide-react";
import * as React from "react";

export function Alert({ children }) {
  return (
    <div className="flex items-start gap-3 p-4 text-sm text-red-700 border border-red-400 rounded-md bg-red-50">
      <AlertCircle className="w-5 h-5 mt-1" />
      <div>{children}</div>
    </div>
  );
}

export function AlertDescription({ children }) {
  return <p className="text-sm">{children}</p>;
}
