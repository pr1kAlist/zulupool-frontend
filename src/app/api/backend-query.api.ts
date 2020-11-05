import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { RestService } from "services/rest.service";
import {
    IUserBalanceItem,
    IFoundBlock,
    IUserPayouts,
    IPoolStatsItem,
    IWorkerStatsItem,
    IUserStatsItem,
    IPoolCoinsItem,
} from "interfaces/backend-query";
import { TCoinName } from "interfaces/coin";

@Injectable({
    providedIn: "root",
})
export class BackendQueryApiService {
    constructor(private restService: RestService) { }

    getUserBalance(
        params: IGetUserBalanceParams = {},
    ): Observable<IGetUserBalanceResponse> {
        return this.restService.post("/backendQueryUserBalance", params);
    }

    getFoundBlocks(
        params: IGetFoundBlocksParams,
    ): Observable<IGetFoundBlocksResponse> {
        return this.restService.post("/backendQueryFoundBlocks", params);
    }

    getUserPayouts(
        params: IGetUserPayoutsParams,
    ): Observable<IGetUserPayoutsResponse> {
        return this.restService.post("/backendQueryPayouts", params);
    }

    getPoolStats(
        params: IGetPoolStatsParams = {},
    ): Observable<IGetPoolStatsResponse> {
        return this.restService.post("/backendQueryPoolStats", params);
    }

    getPoolCoins(): Observable<IGetPoolCoinsResponse> {
        return this.restService.post("/backendQueryCoins");
    }

    getPoolStatsHistory(
        params: IGetPoolStatsHistoryParams,
    ): Observable<IGetPoolStatsHistoryResponse> {
        return this.restService.post("/backendQueryPoolStatsHistory", params);
    }

    getUserStats(
        params: IGetUserStatsParams,
    ): Observable<IGetUserStatsResponse> {
        return this.restService.post("/backendQueryUserStats", params);
    }

    getUserStatsHistory(
        params: IGetUserStatsHistoryParams,
    ): Observable<IGetUserStatsHistoryResponse> {
        return this.restService.post("/backendQueryUserStatsHistory", params);
    }

    getWorkerStatsHistory(
        params: IGetWorkerStatsHistoryParams,
    ): Observable<IGetWorkerStatsHistoryResponse> {
        return this.restService.post("/backendQueryWorkerStatsHistory", params);
    }
}


export interface IGetUserBalanceParams {
    coin?: TCoinName;
}

export interface IGetUserBalanceResponse {
    balances: IUserBalanceItem[];
}

export interface IGetFoundBlocksParams {
    coin: TCoinName;
    heightFrom?: number;
    hashFrom?: string;
    count?: number;
}

export interface IGetUserPayoutsParams {
    coin: string;
    timeFrom?: number;
    count?: number;
}

export interface IGetUserPayoutsResponse {
    payouts: IUserPayouts[];
}

export interface IGetFoundBlocksResponse {
    blocks: IFoundBlock[];
}

export interface IGetPoolStatsParams {
    coin?: TCoinName;
}

export interface IGetPoolStatsResponse {
    stats: IPoolStatsItem[];
}

export interface IGetPoolCoinsResponse {
    coins: IPoolCoinsItem[];
}

export interface IGetPoolStatsHistoryParams {
    coin: TCoinName;
    timeFrom?: number;
    timeTo?: number;
    groupByInterval?: number;
}

export interface IGetPoolStatsHistoryResponse {
    currentTime: number;
    powerUnit: string;
    powerMultLog10: number;
    stats: IWorkerStatsItem[];
}

export interface IGetUserStatsParams {
    coin: TCoinName;
}

export interface IGetUserStatsResponse {
    powerUnit: string;
    powerMultLog10: number;
    currentTime: number;
    total: IUserStatsItem;
    workers: IWorkerStatsItem[];
}

export interface IGetUserStatsHistoryParams {
    coin: TCoinName;
    timeFrom?: number;
    groupByInterval?: number;
    [key: string]: any;
}

export interface IGetUserStatsHistoryResponse {
    powerUnit: string;
    powerMultLog10: number;
    currentTime: number;
    stats: IWorkerStatsItem[];
}

export interface IGetWorkerStatsHistoryParams {
    coin: TCoinName;
    workerId: string;
    timeFrom?: number;
    timeTo?: number;
    groupByInterval?: number;
}

export interface IGetWorkerStatsHistoryResponse {
    powerUnit: string;
    powerMultLog10: number;
    currentTime: number;
    stats: IWorkerStatsItem[];
}
