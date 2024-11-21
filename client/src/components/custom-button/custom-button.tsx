import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading}
        className={`transition-all duration-300 ease-in-out ${className} flex items-center justify-center gap-x-3 disabled:cursor-not-allowed disabled:opacity-60`}
        {...props}
      >
        {isLoading && (
          <div className="flex justify-center">
            <AiOutlineLoading3Quarters className="size-auto animate-spin" />
          </div>
        )}
        {children}
      </button>
    );
  },
);

export default Button;
