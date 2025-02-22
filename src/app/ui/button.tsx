import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "md" | "lg"; // 🔹 Size prop'unu ekledik
}

export const Button: React.FC<ButtonProps> = ({ variant = "default", size = "md", className, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md text-sm font-medium transition";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-lg",
  };

  return <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
};
