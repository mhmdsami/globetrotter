import * as React from "react";
import { UseFormRegister } from "react-hook-form";
import { Label } from "~/components/label";
import { tw } from "~/utils/ui";

export interface InputPrimitiveProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputPrimitive = React.forwardRef<HTMLInputElement, InputPrimitiveProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={tw(
          "border-input ring-offset-background placeholder:text-muted-text focus:border-primary flex h-10 w-full rounded-xl border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
InputPrimitive.displayName = "Input";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  register?: UseFormRegister<any>;
  label?: string;
  errorMessage?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

function Input({
  name,
  label,
  placeholder,
  errorMessage,
  register,
  className,
  labelClassName,
  inputClassName,
  ...props
}: InputProps) {
  return (
    <div className={tw("flex flex-col gap-2", className)}>
      {label && <Label className={labelClassName}>{label}</Label>}
      {register ? (
        <InputPrimitive
          className={className}
          placeholder={placeholder ?? label}
          {...props}
          {...register(name)}
        />
      ) : (
        <InputPrimitive
          className={className}
          placeholder={placeholder ?? label}
          {...props}
        />
      )}
      <p
        className={tw("text-secondary hidden text-sm", errorMessage && "block")}
      >
        {errorMessage}
      </p>
    </div>
  );
}
Input.displayName = "Input";

export { Input, InputPrimitive };
