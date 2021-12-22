export const postBuild = async (
  apiHost: string,
  project: string,
  token: string,
  branch: string,
  yml: string
): Promise<Record<string, any>> => {
  return await fetch(`${apiHost}/builds?project=${project}&branch=${branch}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-token': token,
    },
    body: yml,
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};

export const getBuildStatus = async (
  apiHost: string,
  project: string,
  token: string
): Promise<Record<string, any>> => {
  return await fetch(`${apiHost}/builds/${project}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-token': token,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
export const postDeploy = async (
  apiHost: string,
  project: string,
  token: string,
  image: string,
  port: string,
  replicas: string
): Promise<Record<string, any>> => {
  return await fetch(
    `${apiHost}/deployments?project=${project}&image=${image}&port=${port}&replicas=${replicas}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-token': token,
      },
    }
  )
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
export const getDeployStatus = async (
  apiHost: string,
  project: string,
  token: string
): Promise<Record<string, any>> => {
  return await fetch(`${apiHost}/deployments?name=${name}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-token': token,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};

export const getBuildList = async (
  apiHost: string,
  project: string,
  token: string
): Promise<Record<string, any>> => {
  return await fetch(`${apiHost}/builds?project=${project}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-token': token,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
export const getDeploymentList = async (
  apiHost: string,
  project: string,
  token: string
): Promise<Record<string, any>> => {
  return await fetch(`${apiHost}/deployments?project=${project}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-token': token,
    },
  })
    .then((res: any): any => res.json().then((res: any): any => res))
    .catch((err: any): any => {
      return err;
    });
};
