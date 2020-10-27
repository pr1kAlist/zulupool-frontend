import { Component, OnInit, OnDestroy } from "@angular/core";

import { not } from "logical-not";

import { EAppRoutes } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import { Coin } from "interfaces/coin";
import {
    IUserBalanceItem,
    IUserStatsItem,
    IWorkerStatsItem,
} from "interfaces/backend-query";
import { ESuffix } from "pipes/suffixify.pipe";

enum EWorkerState {
    Normal = "normal",
    Warning = "warning",
    Error = "error,",
}

@Component({
    selector: "app-monitoring",
    templateUrl: "./monitoring.component.html",
    styleUrls: ["./monitoring.component.less"],
})
export class MonitoringComponent implements OnInit, OnDestroy {
    readonly EAppRoutes = EAppRoutes;
    readonly EWorkerState = EWorkerState;
    readonly ESuffix = ESuffix;

    coins: Coin[];
    currentCoin: Coin;

    userBalances: IUserBalanceItem[];
    userStatsItem: IUserStatsItem;
    userStatsItemZeroUnitsOffset: number;
    userStatsHistory = {
        stats: [] as IWorkerStatsItem[],
        powerMultLog10: 0,
    };
    userWorkersStatsList: IWorkerStatsItem[];
    userWorkersStatsHistory: {
        name: string;
        stats: IWorkerStatsItem[];
        powerMultLog10: number;
    };

    tableData = {
        isLoading: false,
        updateTimeoutId: null,
    };
    // acceptedDifficulty: number;

    get balance(): string {
        if (not(this.userBalances)) return "";

        return this.userBalances.find(item => {
            return item.coin === this.currentCoin;
        }).balance;
    }

    constructor(private backendQueryApiService: BackendQueryApiService) {}

    ngOnInit(): void {
        this.backendQueryApiService
            .getUserBalance()
            .subscribe(({ balances }) => {
                this.userBalances = balances;
                this.coins = balances.map(item => item.coin);

                if (this.coins.length > 0) {
                    const coin = this.coins.includes("HTR")
                        ? "HTR"
                        : this.coins[0];

                    this.onCurrentCoinChange(coin);
                }
            });
    }

    ngOnDestroy(): void {
        clearTimeout(this.tableData.updateTimeoutId);
    }

    onCurrentCoinChange(coin: Coin): void {
        this.currentCoin = coin;

        this.updateTablesData();

        this.backendQueryApiService
            .getUserStatsHistory({ coin })
            .subscribe(({ stats, powerMultLog10 }) => {
                // this.setAcceptedDifficulty(stats);

                this.userStatsHistory = { stats, powerMultLog10 };
            });
    }

    onWorkerRowClick(workerId: string): void {
        this.backendQueryApiService
            .getWorkerStatsHistory({
                coin: this.currentCoin,
                workerId,
                groupByInterval: 15 * 60,
            })
            .subscribe(({ stats, powerMultLog10 }) => {
                this.userWorkersStatsHistory = {
                    name: workerId,
                    stats,
                    powerMultLog10,
                };
            });
    }

    getWorkerState(time: number): EWorkerState {
        if (time > 30 * 60) {
            return EWorkerState.Error;
        }

        if (time > 15 * 60) {
            return EWorkerState.Warning;
        }

        return EWorkerState.Normal;
    }

    private updateTablesData(): void {
        this.tableData.isLoading = true;

        clearTimeout(this.tableData.updateTimeoutId);

        this.backendQueryApiService
            .getUserStats({ coin: this.currentCoin })
            .subscribe({
                complete: () => {
                    this.tableData.isLoading = false;

                    this.tableData.updateTimeoutId = setTimeout(() => {
                        this.updateTablesData();
                    }, 45000);
                },
                next: ({ total, workers, currentTime, powerMultLog10 }) => {
                    workers.forEach(item => {
                        item.lastShareTime = currentTime - item.lastShareTime;
                    });
                    workers.sort((a, b) => {
                        return b.lastShareTime - a.lastShareTime;
                    });

                    this.userStatsItem = total;
                    this.userStatsItemZeroUnitsOffset = powerMultLog10;
                    this.userWorkersStatsList = workers;
                    this.tableData.isLoading = false;
                },
            });
    }

    // private setAcceptedDifficulty(stats: IWorkerStatsItem[]): void {
    //     this.acceptedDifficulty = 0;

    //     const today = new Date().getDate();

    //     stats.forEach(item => {
    //         const date = new Date(item.time * 1000);

    //         if (date.getDate() === today && date.getHours()) {
    //             this.acceptedDifficulty += item.shareWork;
    //         }
    //     });
    // }
}
