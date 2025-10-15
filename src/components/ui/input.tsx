"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, X } from "lucide-react";

interface InputProps extends React.ComponentProps<"input"> {
  showPasswordToggle?: boolean;
  clearable?: boolean; // нова пропса
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", showPasswordToggle = false, clearable = false, value: propValue, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [value, setValue] = React.useState(propValue || "");

    const inputType =
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      const event = { target: { value: "" } } as unknown as React.ChangeEvent<HTMLInputElement>;
      setValue("");
      onChange?.(event);
    };

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={handleChange}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            (showPasswordToggle || clearable) && "pr-12", // трохи більше padding для двох кнопок
            className
          )}
          {...props}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {clearable && value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={18} />
            </button>
          )}
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
