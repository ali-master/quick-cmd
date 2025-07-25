import * as React from "react";
import { cn } from "@/libs/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Label component for form fields
 *
 * @example
 * <Label htmlFor="input-id">Field Label</Label>
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  ),
);

Label.displayName = "Label";

export { Label };
