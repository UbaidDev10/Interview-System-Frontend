export const Avatar = ({ children }) => (
  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
    {children}
  </div>
);

export const AvatarFallback = ({ children }) => <>{children}</>;
export const AvatarImage = () => null; // placeholder
