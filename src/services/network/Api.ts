export const get = async (endpoint: string): Promise<unknown> => {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const value: unknown = await response.json();
  return value;
};
