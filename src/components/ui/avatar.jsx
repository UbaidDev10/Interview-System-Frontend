
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn("relative flex size-8 shrink-0 overflow-hidden rounded-full", className)}
      {...props} />
  );
}

function AvatarImage({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props} />
  );
}

function AvatarFallback({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props} />
  );
}

export { Avatar, AvatarImage, AvatarFallback }
=======
export const Avatar = ({ children }) => (
  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
    {children}
  </div>
);

export const AvatarFallback = ({ children }) => <>{children}</>;
export const AvatarImage = () => null; // placeholder
