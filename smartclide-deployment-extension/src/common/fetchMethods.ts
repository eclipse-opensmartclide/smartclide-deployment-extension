import { BASE_URL } from "./constants";

export const fetchBuild = async (
  project: string,
  apiToken: string,
  username?: string
): Promise<Record<string, any>> => {
  // TODO: Remove when backend endpoint are ok
  // return {
  //   status: new Promise((resolve, reject) => {
  //     setTimeout(function () {
  //       resolve("mockDone");
  //     }, 3000);
  //   }),
  // };

  return await fetch(`${BASE_URL}/build/?project=${project}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project,
      username,
    }),
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
export const fetchBuildStatus = async (
  project: string,
  apiToken: string
): Promise<Record<string, any>> => {
  // TODO: Remove when backend endpoint are ok
  // return {
  //   status: new Promise((resolve, reject) => {
  //     setTimeout(function () {
  //       resolve("mockDone");
  //     }, 3000);
  //   }),
  // };

  return await fetch(`${BASE_URL}/build/?project=${project}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
