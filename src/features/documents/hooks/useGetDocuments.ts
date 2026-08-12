import { useCallback, useEffect, useState } from 'react';

import { Document } from '../models/document';
import { get } from '../../../services/Api';
import { endpoints } from '../../../services/endpoints';

interface GetDocumentsState {
  response: Document[];
  isLoading: boolean;
  error: Error | null;
}

export const useGetDocuments = (): GetDocumentsState & {
  refetch: () => void;
} => {
  const [state, setState] = useState<GetDocumentsState>({
    response: [],
    isLoading: true,
    error: null,
  });
  const [request, setRequest] = useState(0);

  useEffect(() => {
    let active = true;

    setState(current => ({ ...current, isLoading: true, error: null }));

    get<Document[]>(endpoints.documents)
      .then(response => {
        if (active) {
          setState({ response, isLoading: false, error: null });
        }
      })
      .catch(reason => {
        if (active) {
          const error =
            reason instanceof Error ? reason : new Error('Unknown error');
          setState(current => ({ ...current, isLoading: false, error }));
        }
      });

    return () => {
      active = false;
    };
  }, [request]);

  const refetch = useCallback(() => {
    setRequest(current => current + 1);
  }, []);

  return { ...state, refetch };
};
