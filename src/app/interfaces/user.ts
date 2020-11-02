import { ERole } from "enums/role";
import { Coin } from "interfaces/coin";

export interface IUser {
    login: string;
    name: string;
    email: string;
    registrationDate: number;
    workers: number;
    shareRate: number;
    power: number;
    lastShareTime: number;
    role: ERole;
    users?: IUser[];

}

export interface IUserSettings {
    name: Coin;
    address: string;
    payoutThreshold: number;
    autoPayoutEnabled: boolean;
}
