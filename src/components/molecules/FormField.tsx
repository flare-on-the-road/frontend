import { Input } from "@/components/atoms";

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
};

export function FormField({
  id,
  label,
  type = "text",
  name,
  placeholder,
  required,
  defaultValue,
}: FormFieldProps) {
  return (
    <div className="space-y-3">
      <label
        className="block text-base font-black text-slate-900 dark:text-cream-50"
        htmlFor={id}
      >
        {label}
      </label>
      <Input
        id={id}
        name={name ?? id}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="h-14 rounded-lg border-warm-300 bg-cream-50 px-5 text-base font-semibold dark:border-slate-700 dark:bg-slate-900"
      />
    </div>
  );
}
