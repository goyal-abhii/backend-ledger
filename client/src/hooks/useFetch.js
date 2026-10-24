import { useCallback, useEffect, useState } from "react";

/**
 * Minimal data-fetching hook with loading / error / reload.
 * Pass a STABLE fetcher (wrap it in useCallback) so effects don't re-run
 * endlessly — this keeps us honest with the react-hooks lint rules.
 */
export function useFetch(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
  }, [fetcher]);

  useEffect(() => {
    load();
  }, [load]);

  const setData = useCallback((data) => setState((s) => ({ ...s, data })), []);

  return { ...state, reload: load, setData };
}
