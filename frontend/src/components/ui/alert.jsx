// components/ui/alert.jsx
import { AlertCircle, CheckCircle } from "lucide-react";
import * as React from "react";

export function Alert({ 
  variant = "error", 
  children, 
  className = "" 
}) {
  const baseStyles = "flex items-start gap-3 p-4 text-sm rounded-md border";
  
  const variantStyles = {
    error: "text-red-800 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800",
    success: "text-green-800 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
  };

  const icon = variant === "error" ? 
    <AlertCircle className="w-5 h-5 mt-1" /> : 
    <CheckCircle className="w-5 h-5 mt-1" />;

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      role={variant === "error" ? "alert" : "status"}
    >
      {icon}
      <div>{children}</div>
    </div>
  );
}

export function AlertDescription({ children }) {
  return <p className="text-sm">{children}</p>;
}