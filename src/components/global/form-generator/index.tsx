import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@hookform/error-message";
import { useEffect, useState } from "react";
import {
  FieldErrors,
  FieldValues,
  useFormContext,
  UseFormRegister,
  useWatch,
} from "react-hook-form";

type Props = {
  type?: "text" | "email" | "password" | "number";
  inputType: "select" | "input" | "textarea";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  name: string;
  errors: FieldErrors<FieldValues>;
  lines?: number;
  checkExists?: (name: string) => Promise<{ status: number; message: string }>;
};

const FormGenerator = ({
  inputType,
  options,
  label,
  placeholder,
  register,
  name,
  errors,
  type,
  lines,
  checkExists,
}: Props) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  const watchedValue = useWatch({ name });
  const { setError, clearErrors } = useFormContext();

  useEffect(() => {
    console.log("watchedValue is changing : ", watchedValue);
    const handler = setTimeout(() => {
      setDebouncedValue(watchedValue);
    }, 600);

    return () => {
      clearTimeout(handler);
    };
  }, [watchedValue]);

  useEffect(() => {
    const createFolder = async () => {
      try {
        if (checkExists) {
          const result = await checkExists(debouncedValue);
          console.log(result);
          if (result.status >= 400) {
            setError(name, { type: "manual", message: result.message });
          } else {
            clearErrors(name);
          }
        }
      } catch {
        console.error("Oops something went wrong");
      }
    };

    if (debouncedValue) {
      createFolder();
    }
  }, [debouncedValue, checkExists, clearErrors, name, setError]);

  switch (inputType) {
    case "input":
      return (
        <Label
          className="flex flex-col gap-2 text-[#9D9D9D]"
          htmlFor={`input-${label}`}
        >
          {label && label}
          <Input
            id={`input-${label}`}
            type={type}
            placeholder={placeholder}
            className="bg-transparent border-themeGray text-themeTextGray"
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
          {/* {errorMessage && <p className="text-red-400 mt-2">{errorMessage}</p>} */}
        </Label>
      );
    case "select":
      return (
        <Label htmlFor={`select-${label}`} className="flex flex-col gap-2">
          {label && label}
          <select
            id={`select-${label}`}
            className="w-full bg-transparent border-[1px] p-3 rounded-lg"
            {...register(name)}
          >
            {options?.length &&
              options.map((option) => (
                <option
                  value={option.value}
                  key={option.id}
                  className="dark:bg-muted"
                >
                  {option.label}
                </option>
              ))}
          </select>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );

    case "textarea":
      return (
        <Label className="flex flex-col gap-2" htmlFor={`input-${label}`}>
          {label && label}
          <Textarea
            className="bg-transparent border-themeGray text-themeTextGray"
            id={`input-${label}`}
            placeholder={placeholder}
            rows={lines}
            {...register(name)}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-red-400 mt-2">
                {message === "Required" ? "" : message}
              </p>
            )}
          />
        </Label>
      );

    default:
      break;
  }
};

export default FormGenerator;
