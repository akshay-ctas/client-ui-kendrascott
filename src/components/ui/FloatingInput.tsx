import { InputHTMLAttributes, ReactNode, forwardRef, useId } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const FloatingInput = forwardRef<HTMLInputElement, Props>(
  (
    { label, error, hint, leftIcon, className = "", disabled, ...props },
    ref,
  ) => {
    const id = useId();

    return (
      <div className="group flex flex-col gap-1.5 w-full">
        <div className="relative w-full">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-400 transition-colors duration-200 pointer-events-none z-10">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            placeholder=" "
            disabled={disabled}
            aria-describedby={
              error ? `${id}-error` : hint ? `${id}-hint` : undefined
            }
            aria-invalid={!!error}
            className={[
              "peer w-full text-sm text-stone-800 bg-transparent",
              "outline-none transition-all duration-200",
              "py-3",
              leftIcon ? "pl-10" : "px-3.5",
              disabled ? "text-stone-400 cursor-not-allowed" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          <fieldset
            aria-hidden="true"
            className={[
              "absolute inset-0 rounded-xl pointer-events-none",
              "border transition-colors duration-200",
              error
                ? "border-red-400 peer-focus:border-red-500"
                : "border-stone-300 peer-focus:border-yellow-400",
              disabled ? "border-stone-200" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <legend
              className={[
                "ml-2.5 text-[11px] h-0 leading-none transition-[max-width] duration-200 whitespace-nowrap overflow-hidden",
                "max-w-0",
                "peer-focus:max-w-[calc(100%)] peer-[:not(:placeholder-shown)]:max-w-[calc(100%)]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="px-0.5 opacity-0 select-none">{label}</span>
            </legend>
          </fieldset>

          <label
            htmlFor={id}
            className={[
              "absolute pointer-events-none select-none bg-white",
              "transition-all duration-200 ease-out",
              leftIcon ? "left-10" : "left-3",

              "top-0 -translate-y-1/2 text-[11px] font-medium px-1",

              "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
              "peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:px-0",
              leftIcon
                ? "peer-placeholder-shown:left-10"
                : "peer-placeholder-shown:left-3.5",

              "peer-focus:top-0 peer-focus:-translate-y-1/2",
              "peer-focus:text-[11px] peer-focus:font-medium peer-focus:px-1",
              leftIcon ? "peer-focus:left-3" : "peer-focus:left-3",

              error
                ? "text-red-500 peer-placeholder-shown:text-stone-400 peer-focus:text-red-500"
                : "text-yellow-500 peer-placeholder-shown:text-stone-400 peer-focus:text-yellow-500",
              disabled ? "text-stone-300!" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
          </label>
        </div>

        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="flex items-center gap-1 text-xs text-red-500 px-1"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="shrink-0"
            >
              <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
              <path
                d="M6 3.5v3M6 8h.01"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={`${id}-hint`} className="text-xs text-stone-400 px-1">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

FloatingInput.displayName = "FloatingInput";
export default FloatingInput;
