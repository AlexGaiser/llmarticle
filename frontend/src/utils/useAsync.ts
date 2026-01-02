import { useState, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

type AsyncAction<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

export const useAsync = <T, Args extends unknown[] = []>(
  asyncFn: AsyncAction<T, Args>
) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ data: null, error: null, loading: true });
      try {
        const result = await asyncFn(...args);
        setState({ data: result, error: null, loading: false });
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An error occurred";
        setState({ data: null, error: message, loading: false });
        throw err;
      }
    },
    [asyncFn]
  );

  return { ...state, execute };
};
