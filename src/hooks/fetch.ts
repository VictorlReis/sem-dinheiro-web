import useSWR from 'swr';
import vars from '../config/config';
import axios from 'axios';

async function http<T>(
  path: string,
  config: RequestInit,
  base: string,
): Promise<T> {
  //const configWithToken = await addBearerToken(path, config);
  const request = new Request(`${base}${path}`, config);
  const response = await fetch(request);

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  // may error if there is no defined body, return empty array
  return response.json().catch(() => ({}));
}

export function useFetch<Data = any, Error = any>(
  url: string,
  base: string = vars.uri,
  config?: RequestInit,
) {
  const { data, error, mutate } = useSWR<Data, Error>(url, async (url) => {
    return await get(url, base, config);
  });
  return { data, error, mutate };
}

export async function get<T>(
  path: string,
  base: string = vars.uri,
  config?: RequestInit,
): Promise<T> {
  const init = { method: 'get', ...config };
  return await http<T>(path, init, base);
}

export async function postFile<T, U>(
  path: string,
  body: T,
  base: string = vars.uri,
): Promise<U> {
  await axios.post(`${base}${path}`, body, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function post<T, U>(
  path: string,
  body: T,
  base: string = vars.uri,
  config?: RequestInit,
): Promise<U> {
  const init = {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
    ...config,
  };
  return await http<U>(path, init, base);
}
export async function put<T, U>(
  path: string,
  body: T,
  base: string = vars.uri,
  config?: RequestInit,
): Promise<U> {
  const init = {
    method: 'put',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
    ...config,
  };
  return await http<U>(path, init, base);
}

export async function patch<T, U>(
  path: string,
  body: T,
  base: string = vars.uri,
  config?: RequestInit,
): Promise<U> {
  const init = {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
    ...config,
  };
  return await http<U>(path, init, base);
}

export async function remove<U>(
  path: string,
  base: string = vars.uri,
  config?: RequestInit,
): Promise<U> {
  const init = {
    method: 'DELETE',
    ...config,
  };
  return await http<U>(path, init, base);
}
