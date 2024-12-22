import {
  MutationFunction,
  MutationKey,
  useMutation,
  useMutationState,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutationData = (
  mutationKey: MutationKey,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutationFn: MutationFunction<any, any>,
  queryKey?: string | readonly string[],
  onSuccess?: () => void
) => {
  const client = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationKey,
    mutationFn,
    onSuccess(data) {
      if (onSuccess) onSuccess();
      toast(
        data?.status === 200 || data?.status === 201 ? "Success" : "Error",
        {
          description: data?.message,
        }
      );
    },
    onSettled: async () => {
      if (!queryKey) return;

      const keysToInvalidate = Array.isArray(queryKey) ? queryKey : [queryKey];

      await Promise.all(
        keysToInvalidate.map((key) =>
          client.invalidateQueries({
            queryKey: [key],
            exact: true,
          })
        )
      );
    },
  });

  return { mutate, isPending, isSuccess };
};

export const useMutationDataState = (mutationKey: MutationKey) => {
  const data = useMutationState({
    filters: { mutationKey },
    select: (mutation) => {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variables: mutation.state.variables as any,
        status: mutation.state.status,
      };
    },
  });

  const latestVariables = data[data.length - 1];
  return { latestVariables };
};
