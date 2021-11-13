import { BASE_URL } from "./constants";

export const fetchBuild = async (
  project: string,
  token: string
): Promise<Record<string, any>> => {
  return await fetch(`${BASE_URL}/build?project=${project}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": "THaukuexsHeVnCqFBZTw",
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
export const fetchBuildStatus = async (
  project: string,
  token: string
): Promise<Record<string, any>> => {
  return await fetch(`${BASE_URL}/build?project=${project}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-token": "THaukuexsHeVnCqFBZTw",
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
