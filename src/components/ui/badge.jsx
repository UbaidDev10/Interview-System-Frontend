export const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-blue-600 text-white",
    outline: "border border-gray-400 text-gray-700",
    secondary: "bg-gray-600 text-white",
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-sm font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
};
