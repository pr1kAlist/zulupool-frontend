import { Component, OnInit } from "@angular/core";

import { EAppRoutes } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import { Coin } from "interfaces/coin";
import { IUserStatsItem, IWorkerStatsItem } from "interfaces/backend-query";
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
export class MonitoringComponent implements OnInit {
    readonly EAppRoutes = EAppRoutes;
    readonly EWorkerState = EWorkerState;
    readonly ESuffix = ESuffix;

    coins: Coin[];
    currentCoin: Coin;

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

    acceptedDifficulty: number;

    constructor(private backendQueryApiService: BackendQueryApiService) {}

    ngOnInit(): void {
        this.backendQueryApiService
            .getUserBalance()
            .subscribe(({ balances }) => {
                balances = balances.filter(item => item.coin === "HTR");

                this.coins = balances.map(item => item.coin);

                if (this.coins.length > 0) {
                    this.onCurrentCoinChange(this.coins[0]);
                }
            });
    }

    onCurrentCoinChange(coin: Coin): void {
        this.currentCoin = coin;

        this.backendQueryApiService
            .getUserStats({ coin })
            .subscribe(({ total, workers, currentTime, powerMultLog10 }) => {
                workers.forEach(item => {
                    item.lastShareTime = currentTime - item.lastShareTime;
                });

                this.userStatsItem = total;
                this.userStatsItemZeroUnitsOffset = powerMultLog10;
                this.userWorkersStatsList = workers;

                this.userWorkersStatsList.sort((a, b) => {
                    return b.lastShareTime - a.lastShareTime;
                });
            });

        this.backendQueryApiService
            .getUserStatsHistory({ coin })
            .subscribe(({ stats, powerMultLog10 }) => {
                this.setAcceptedDifficulty(stats);

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

    private setAcceptedDifficulty(stats: IWorkerStatsItem[]): void {
        this.acceptedDifficulty = 0;

        const today = new Date().getDate();

        stats.forEach(item => {
            const date = new Date(item.time * 1000);

            if (date.getDate() === today && date.getHours()) {
                this.acceptedDifficulty += item.shareWork;
            }
        });
    }
}
