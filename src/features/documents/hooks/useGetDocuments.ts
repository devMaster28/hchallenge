import { useCallback, useEffect, useState } from 'react';

import type { Document } from '../models/document';
import { get } from '../../../services/network/Api';
import { endpoints } from '../../../services/network/endpoints';
import { toError } from '../../../utils/error';

interface GetDocumentsState {
  response: Document[];
  isLoading: boolean;
  error: Error | null;
}

interface UseGetDocumentsResult {
  response: Document[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useGetDocuments = (): UseGetDocumentsResult => {
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
          setState({
            response,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch(reason => {
        if (active) {
          setState(current => ({
            ...current,
            isLoading: false,
            error: toError(reason),
          }));
        }
      });

    return () => {
      active = false;
    };
  }, [request]);

  const refetch = useCallback(() => {
    setRequest(current => current + 1);
  }, []);

  return {
    ...state,
    refetch,
  };
};
