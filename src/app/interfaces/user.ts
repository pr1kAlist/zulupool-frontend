import { ERole } from "enums/role";

export interface IUser {
    name: string;
    email: string;
    registrationDate: number;
    role: ERole;
    users?: IUser[];
}
