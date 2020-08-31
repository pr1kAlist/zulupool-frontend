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
} from "interfaces/backend-query";
import { ECoins } from "enums/coins";

@Injectable({
    providedIn: "root",
})
export class BackendQueryApiService {
    constructor(private restService: RestService) {}

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
    coin?: ECoins;
}

export interface IGetUserBalanceResponse {
    balances: IUserBalanceItem[];
}

export interface IGetFoundBlocksParams {
    coin: ECoins;
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
    coin?: ECoins;
}

export interface IGetPoolStatsResponse {
    stats: IPoolStatsItem[];
}

export interface IGetPoolStatsHistoryParams {
    coin: ECoins;
    timeFrom?: number;
    timeTo?: number;
    groupByInterval?: number;
}

export interface IGetPoolStatsHistoryResponse {
    powerUnit: string;
    powerMultLog10: number;
    stats: IWorkerStatsItem[];
}

export interface IGetUserStatsParams {
    coin: ECoins;
}

export interface IGetUserStatsResponse {
    powerUnit: string;
    powerMultLog10: number;
    total: IUserStatsItem;
    workers: IWorkerStatsItem[];
}

export interface IGetUserStatsHistoryParams {
    coin: ECoins;
    timeFrom?: number;
    groupByInterval?: number;
    [key: string]: any;
}

export interface IGetUserStatsHistoryResponse {
    powerUnit: string;
    powerMultLog10: number;
    stats: IWorkerStatsItem[];
}

export interface IGetWorkerStatsHistoryParams {
    coin: ECoins;
    workerId: string;
    timeFrom?: number;
    timeTo?: number;
    groupByInterval?: number;
}

export interface IGetWorkerStatsHistoryResponse {
    powerUnit: string;
    powerMultLog10: number;
    stats: IWorkerStatsItem[];
}
