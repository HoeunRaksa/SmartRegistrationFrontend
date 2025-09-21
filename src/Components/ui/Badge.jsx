import React from "react";

const Badge = ({ children, className }) => <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{children}</span>;

export { Badge };