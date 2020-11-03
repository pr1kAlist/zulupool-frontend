import { Component, OnInit } from "@angular/core";

import { EAppRoutes } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import { Coin } from "interfaces/coin";
import { IWorkerStatsItem } from "interfaces/backend-query";
import { AppService } from "services/app.service";
import { ESuffix } from "pipes/suffixify.pipe";
import { ETime } from "enums/time";

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
    styleUrls: ["./history.component.less"],
})
export class HistoryComponent implements OnInit {
    readonly EAppRoutes = EAppRoutes;
    readonly ESuffix = ESuffix;

    coins: Coin[];
    currentCoin: Coin;

    statsHistory: IWorkerStatsItem[];
    powerMultLog10: number;

    constructor(
        private backendQueryApiService: BackendQueryApiService,
        private appService: AppService,
    ) { }

    ngOnInit(): void {
        this.getCoinsList();
        /*this.backendQueryApiService
            .getUserBalance()
            .subscribe(({ balances }) => {
                balances = balances.filter(item => item.coin === "sha256");

                this.coins = balances.map(item => item.coin);

                if (this.coins.length > 0) {
                    this.onCurrentCoinChange(this.coins[0]);
                }
            });*/
    }

    private getCoinsList(): void {
        this.backendQueryApiService
            .getPoolCoins()
            .subscribe(({ poolCoins }) => {
                if (poolCoins.length >= 2) {
                    poolCoins.push({ name: poolCoins[0].algorithm, fullName: poolCoins[0].algorithm, algorithm: poolCoins[0].algorithm })
                }
                this.coins = poolCoins.map(item => item.name);
                if (this.coins.length > 0) {
                    const coin = this.coins.includes(poolCoins[0].algorithm)
                        ? poolCoins[0].algorithm
                        : this.coins[0];
                    this.onCurrentCoinChange(coin);
                }
            });
    }


    public onCurrentCoinChange(coin: Coin): void {
        this.currentCoin = coin;
        const groupByInterval = ETime.Day;

        this.appService.user.subscribe(user => {
            this.backendQueryApiService
                .getUserStatsHistory({
                    coin,
                    timeFrom: user.registrationDate,
                    groupByInterval,
                })
                .subscribe(({ stats, powerMultLog10 }) => {
                    stats.reverse();

                    stats.forEach(item => {
                        item.time -= groupByInterval;
                    });

                    this.statsHistory = stats;
                    this.powerMultLog10 = powerMultLog10;
                });
        });
    }
}
