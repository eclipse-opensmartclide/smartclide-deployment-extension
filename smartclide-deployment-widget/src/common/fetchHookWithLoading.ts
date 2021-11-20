import { useState, useEffect } from 'react';

const fetchHookWithLoading = (fetchFn: any, props: Record<string, any>) => {
  const [state, setState] = useState({
    loading: true,
    data: null,
    error: null,
  });
  useEffect(() => {
    fetchFn(props)
      .then((response: any) => {
        setState({
          loading: false,
          data: response.data,
          error: null,
        });
      })
      .catch((error: any) => {
        setState({
          loading: false,
          data: null,
          error,
        });
      });
    return () => {};
  }, [fetchFn, props]);
  return {
    loading: state.loading,
    data: state.data,
    error: state.error,
  };
};

export default fetchHookWithLoading;
