import { useState, useEffect } from 'react'

const useFetchOnce = <T>(
  input: RequestInfo,
  responseType: keyof Pick<Body, "json" | "blob" | "arrayBuffer" | "formData" | "text">,
  init?: RequestInit
) => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const response = await fetch(input, init);
        const responseData = await response[responseType]() as T;

        setData(responseData);
      } catch(err: unknown) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {data, loading, error};
}

export { useFetchOnce };