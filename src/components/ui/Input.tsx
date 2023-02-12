// components/button.ts
import { type VariantProps, cva } from "class-variance-authority";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

// ⚠️ Disclaimer: Use of Tailwind CSS is optional

const input = cva("input", {
  variants: {
    intent: {
      primary: ["w-full rounded-md bg-[rgba(0,0,0,0.4)] text-white px-4 py-4"],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

const warning = cva("warning", {
  variants: {
    intent: {
      primary: ["bg-red-800 text-white"],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

const formChildSchema = z.object({ name: z.string() });
type formChildProps = z.infer<typeof formChildSchema>;

export interface InputProps
  extends React.HTMLAttributes<HTMLInputElement>,
    VariantProps<typeof input>,
    formChildProps {}

export interface TextAreaProps
  extends React.HTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof input>,
    formChildProps {}

export interface WarningProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof warning> {}

export const Input: React.FC<InputProps> = ({
  className,
  intent,
  ...props
}) => {
  const c = useFormContext();
  return (
    <input
      {...c.register(props.name)}
      {...props}
      className={input({ intent, className })}
    />
  );
};

export const TextArea: React.FC<TextAreaProps> = ({
  className,
  intent,
  ...props
}) => {
  const c = useFormContext();
  return (
    <textarea
      {...c.register(props.name)}
      {...props}
      className={input({ intent, className })}
    />
  );
};

export const Warning: React.FC<WarningProps> = ({
  className,
  intent,
  ...props
}) => <p className={warning({ intent, className })} {...props} />;
