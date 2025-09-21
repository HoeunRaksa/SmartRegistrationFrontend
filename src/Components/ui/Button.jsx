import React from "react";

const Button = ({ children, variant = "default", className, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium";
  const variantClasses = variant === "outline" 
    ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50" 
    : "bg-blue-600 text-white hover:bg-blue-700";
  
  return <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>{children}</button>;
};

export { Button };