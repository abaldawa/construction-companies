/**
 * @author Abhijit Baldawa
 */
import { useState, useEffect } from 'react'

/**
 * A custom hook which wraps the native 'fetch' function
 * providing data, loading and error state for all supported response type
 *
 * @param input
 * @param responseType
 * @param init
 */
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

  return {data, loading, error, setData};
}

export { useFetchOnce };