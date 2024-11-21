import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isValidationError?: boolean;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, isValidationError, ...props }, ref) => {
    return (
      <input
        className={`mt-2 w-[460px] rounded-xl border border-transparent bg-purple-primary/10 px-4 py-3 text-sm transition-all placeholder:text-black-primary/50 hover:border-black-primary/50 focus:outline-none ${isValidationError && "!border-red-600"} ${className}`}
        ref={ref}
        {...props}
      />
    );
  },
);

export default FormInput;
