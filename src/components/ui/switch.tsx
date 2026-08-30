import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
          ref={ref}
          {...props}
        />
        <div className={cn(
          "w-9 h-5 bg-muted rounded-full peer peer-focus:outline-none transition-colors duration-200",
          "peer-checked:bg-primary",
          "after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:rounded-full after:h-4 after:w-4 after:transition-all duration-200 shadow-sm",
          "peer-checked:after:translate-x-4",
          className
        )} />
      </label>
    )
  }
)
Switch.displayName = "Switch"
