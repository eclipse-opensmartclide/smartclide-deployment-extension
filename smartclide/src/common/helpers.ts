export interface ProjectProps {
  project: string;
  token: string;
  deploy?: string;
  deployments?: string;
}

export const getDataLocalStorage = async (
  localStorageService: any,
  currentProject: string
): Promise<Record<string, any>[] | null[]> => {
  if (!localStorageService || !currentProject) {
    return [null];
  }
  const data = (await localStorageService.getData(`${currentProject}`)) || "";
  return data ? JSON.parse(data) : [null];
};

export const getCurrentLocalData = async (
  localStorageService: any,
  currentProject: string
): Promise<ProjectProps | null> => {
  return await getDataLocalStorage(localStorageService, currentProject)
    .then((projects: ProjectProps[]) => {
      return projects?.filter((project: ProjectProps) => {
        return project?.project === currentProject && project;
      })[0];
    })
    .catch((err) => err);
};
export const getRestLocalData = async (
  localStorageService: any,
  currentProject: string
): Promise<ProjectProps[] | null[]> => {
  return await getDataLocalStorage(localStorageService, currentProject).then(
    (projects: ProjectProps[] | []) => {
      return projects?.filter((project: ProjectProps) => {
        return project?.project !== currentProject && project;
      });
    }
  );
};
