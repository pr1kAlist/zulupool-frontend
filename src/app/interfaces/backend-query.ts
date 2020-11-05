import { TCoinName } from "interfaces/coin";
import { EPowerUnit } from "enums/power-unit";

export interface IUserBalanceItem {
    coin: TCoinName;
    balance: string;
    requested: string;
    paid: string;
}

export interface IFoundBlock {
    height: number;
    hash: string;
    time: number;
    confirmations: number;
    generatedCoins: string;
    foundBy: string;
}

export interface IUserPayouts {
    time: number;
    txid: string;
    value: string;
}

export interface IPoolCoinsItem {
    name: TCoinName;
    fullName: string;
    algorithm: string;
}

export interface IPoolStatsItem {
    coin: TCoinName;
    clients: number;
    workers: number;
    shareRate: number;
    shareWork: number;
    power: number;
    powerMultLog10: number;
    powerUnit: EPowerUnit;
    lastShareTime: number;
}

export interface IWorkerStatsItem {
    name: string;
    time: number;
    shareRate: number;
    shareWork: number;
    power: number;
    lastShareTime: number;
}

export interface IUserStatsItem {
    clients: number;
    workers: number;
    shareRate: number;
    shareWork: number;
    power: number;
    lastShareTime: number;
}
