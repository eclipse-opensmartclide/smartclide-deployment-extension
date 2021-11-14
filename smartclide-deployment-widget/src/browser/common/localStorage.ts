export interface ProjectProps {
  project: string;
  token: string;
  build?: string;
  deploy?: string;
  deployments?: string;
}

export class ManageLocalStorage {
  getAllLocalStorage = (key: string): ProjectProps[] | string[] => {
    if (!localStorage || !key) {
      return [''];
    }
    const projects: string = localStorage.getItem(key) || '';
    return JSON.parse(projects);
  };

  setLocalStorage = (key: string, data: Record<string, any>) => {
    key && localStorage.setItem(key, JSON.stringify(data));
  };
}
