import { ECoins } from "enums/coins";

export interface IUserBalanceItem {
    coin: string;
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

export interface IPoolStatsItem {
    coin: ECoins;
    clients: number;
    workers: number;
    shareRate: number;
    shareWork: number;
    power: number;
}

export interface IWorkerStatsItem {
    name: string;
    time: number;
    shareRate: number;
    shareWork: number;
    power: number;
}

export interface IUserStatsWorker {
    name: string;
    shareRate: number;
    shareWork: number;
    power: number;
}
