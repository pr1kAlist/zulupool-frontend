import { Component, OnInit, OnDestroy } from "@angular/core";

import { not } from "logical-not";

import { EAppRoutes } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import { BackendManualApiService } from "api/backend-manual.api";
import { TCoinName } from "interfaces/coin";
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

    coins: TCoinName[];
    currentCoin: TCoinName;

    userBalances: IUserBalanceItem[];
    userStatsItem: IUserStatsItem;
    userStatsItemZeroUnitsOffset: number;
    userStatsHistory = {
        stats: [] as IWorkerStatsItem[],
        powerMultLog10: 0,
    };
    userWorkersStatsList: IWorkerStatsItem[];
    userWorkersStatsHistory: {
        stats: IWorkerStatsItem[];
        powerMultLog10: number;
    };

    tableData = {
        isLoading: false,
        updateTimeoutId: null,
    };
    // acceptedDifficulty: number;

    get balance(): string {
        if (not(this.userBalances) || this.currentCoin === "sha256") return "";

        return this.userBalances.find(item => {
            return item.coin === this.currentCoin;
        }).balance;
    }

    isManualPayoutSending = false;

    constructor(
        private backendQueryApiService: BackendQueryApiService,
        private backendManualApiService: BackendManualApiService
    ) { }

    ngOnInit(): void {
        this.getCoinsList();

    }

    ngOnDestroy(): void {
        clearTimeout(this.tableData.updateTimeoutId);
    }

    onCurrentCoinChange(coin: TCoinName): void {
        this.currentCoin = coin;

        this.getUserStat(coin);
        //this.backendQueryApiService
        //.getUserStatsHistory({ coin })
        //.subscribe(({ stats, powerMultLog10 }) => {
        // this.setAcceptedDifficulty(stats);

        //this.userStatsHistory = { stats, powerMultLog10 };
        //});
    }

    onWorkerRowClick(workerId: string): void {
        var lastPower = this.userWorkersStatsList.find(item => {
            return item.name === workerId;
        }).power;
        let timeFrom = (new Date().valueOf() / 1000 as any).toFixed(0) - (3 * 24 * 60 * 60);
        let groupByInterval = 15 * 60;
        this.backendQueryApiService
            .getWorkerStatsHistory({
                coin: this.currentCoin,
                workerId,
                timeFrom,
                groupByInterval
            })
            .subscribe(({ stats, powerMultLog10, currentTime }) => {
                if (stats.length > 0) {
                    const lastStatTime = stats[stats.length - 1].time;
                    if (currentTime < lastStatTime) {
                        stats[stats.length - 1].time = currentTime;
                        stats[stats.length - 1].power = lastPower;
                    }
                    if (stats.length > 2) stats.shift();
                    this.userWorkersStatsHistory = {
                        stats,
                        powerMultLog10,
                    };
                }
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

    private getCoinsList(): void {
        this.backendQueryApiService
            .getPoolCoins()
            .subscribe(({ coins }) => {
                if (coins.length >= 2) {
                    coins.push({ name: coins[0].algorithm, fullName: coins[0].algorithm, algorithm: coins[0].algorithm })
                }
                this.coins = coins.map(item => item.name);
                if (this.coins.length > 0) {
                    const coin = this.coins.includes(coins[0].algorithm)
                        ? coins[0].algorithm
                        : this.coins[0];
                    this.getUserStat(coin);

                    this.onCurrentCoinChange(coin);
                }
            });
    }

    private getUserBalance(): void {
        this.backendQueryApiService
            .getUserBalance()
            .subscribe(({ balances }) => {
                this.userBalances = balances;
            });
    }

    private getUserStat(coinName: TCoinName): void {
        this.currentCoin = coinName;
        this.updateTablesData();
    }

    private getUserStatsHistory(coinName: TCoinName, liveStats: IUserStatsItem): void {
        let timeFrom = (new Date().valueOf() / 1000 as any).toFixed(0) - (1.5 * 24 * 60 * 60);
        let groupByInterval = 30 * 60;
        this.backendQueryApiService
            .getUserStatsHistory({ coin: coinName, timeFrom, groupByInterval })
            .subscribe(({ stats, powerMultLog10, currentTime }) => {
                if (stats.length > 0) {
                    const lastStatTime = stats[stats.length - 1].time;
                    if (currentTime < lastStatTime) {
                        stats[stats.length - 1].time = liveStats.lastShareTime;
                        stats[stats.length - 1].power = liveStats.power;
                    }
                    if (stats.length > 2) stats.shift();
                    this.userStatsHistory = { stats, powerMultLog10 };
                }
            });
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
                    this.getUserStatsHistory(this.currentCoin, total);
                    this.getUserBalance();
                    this.userStatsItemZeroUnitsOffset = powerMultLog10;
                    this.userWorkersStatsList = workers;
                    this.tableData.isLoading = false;
                },
            });
    }

    manualPayout(): void {
        this.isManualPayoutSending = true;
        const coin = this.currentCoin;
        this.backendManualApiService.forcePayout({ coin }).subscribe(
            () => {
                this.isManualPayoutSending = false;
            },
            () => {
                this.isManualPayoutSending = false;
            },
        );
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
