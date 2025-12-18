const Card = ({ children, className }) => <div className={`rounded-3xl   ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardContent = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`font-semibold ${className}`}>{children}</h3>;
const CardDescription = ({ children, className }) => <p className={`text-sm ${className}`}>{children}</p>;
export { Card, CardHeader, CardContent, CardTitle, CardDescription };