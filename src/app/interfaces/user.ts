import { ERole } from "enums/role";
import { Coin } from "interfaces/coin";

export interface IUser {
    name: string;
    email: string;
    registrationDate: number;
    role: ERole;
    users?: IUser[];
}

export interface IUserSettings {
    name: Coin;
    address: string;
    payoutThreshold: number;
    autoPayoutEnabled: boolean;
}
