import { AxiosResponse } from 'axios';

export default class MissingPermissionsError extends Error {
  public constructor(permission: string, public response: AxiosResponse) {
    super(`Lacking ${permission} permission`);
  }
}
