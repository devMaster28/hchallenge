
export const get = async <Response>(
  endpoint: string,
): Promise<Response> => {
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json() as Promise<Response>;
    
  }catch (error) {
    throw (error);
  }
  
};
