export const getDataLocalStorage = async (
  localStorageService: any,
  username: string
): Promise<Record<string, any> | undefined> => {
  if (!localStorageService || !username) {
    return undefined;
  }
  const data = (await localStorageService.getData(`${username}`)) || "";
  return data ? JSON.parse(data) : undefined;
};
