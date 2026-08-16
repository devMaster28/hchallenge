import { useCallback, useEffect, useRef, useState } from 'react';

import { parseDocumentsResponse } from '../dto/documentDto';
import type { Document } from '../models/document';
import { get } from '../../../services/network/Api';
import { endpoints } from '../../../services/network/endpoints';
import { toError } from '../../../utils/error';

interface GetDocumentsState {
  response: Document[];
  isLoading: boolean;
  hasFetched: boolean;
  error: Error | null;
}

interface UseGetDocumentsResult {
  response: Document[];
  isLoading: boolean;
  hasFetched: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UseGetDocumentsOptions {
  enabled?: boolean;
}

export const useGetDocuments = ({
  enabled = true,
}: UseGetDocumentsOptions = {}): UseGetDocumentsResult => {
  const [state, setState] = useState<GetDocumentsState>({
    response: [],
    isLoading: enabled,
    hasFetched: false,
    error: null,
  });
  const [request, setRequest] = useState(0);
  const lastHandledRequest = useRef(0);

  useEffect(() => {
    const hasPendingManualRequest = request > lastHandledRequest.current;

    if (!enabled && !hasPendingManualRequest) {
      return;
    }

    lastHandledRequest.current = request;
    let active = true;

    setState(current => ({ ...current, isLoading: true, error: null }));

    get(endpoints.documents)
      .then(parseDocumentsResponse)
      .then(response => {
        if (active) {
          setState({
            response,
            isLoading: false,
            hasFetched: true,
            error: null,
          });
        }
      })
      .catch(reason => {
        if (active) {
          setState(current => ({
            ...current,
            isLoading: false,
            hasFetched: true,
            error: toError(reason),
          }));
        }
      });

    return () => {
      active = false;
    };
  }, [enabled, request]);

  const refetch = useCallback(() => {
    setRequest(current => current + 1);
  }, []);

  return {
    ...state,
    refetch,
  };
};
