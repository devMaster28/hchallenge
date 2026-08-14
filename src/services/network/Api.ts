export const get = async <Response>(
  endpoint: string,
): Promise<Response> => {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<Response>;
};
