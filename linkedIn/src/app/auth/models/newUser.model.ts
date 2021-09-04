import {Role} from './user.model';

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
