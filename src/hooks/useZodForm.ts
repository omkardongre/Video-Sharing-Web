import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutateFunction } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import z, { ZodSchema } from "zod";

const useZodForm = (
  schema: ZodSchema,
  mutation: UseMutateFunction,
  defaultValues?: any
) => {
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  });

  const onFormSubmit = methods.handleSubmit(async (values) => {
    if (Object.keys(methods.formState.errors).length === 0) {
      mutation({ ...values });
    } else {
      methods.reset();
    }
  });

  return { methods, onFormSubmit };
};
export default useZodForm;
