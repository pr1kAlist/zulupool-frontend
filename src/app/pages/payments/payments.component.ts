import { Component, OnInit } from "@angular/core";

import { EAppRoutes } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import { ECoins } from "enums/coins";
import { IWorkerStatsItem } from "interfaces/backend-query";
import { AppService } from "services/app.service";

@Component({
    selector: "app-payments",
    templateUrl: "./payments.component.html",
})
export class PaymentsComponent implements OnInit {
    readonly EAppRoutes = EAppRoutes;

    coins: ECoins[];
    currentCoin: ECoins;

    statsHistory: IWorkerStatsItem[];

    constructor(
        private backendQueryApiService: BackendQueryApiService,
        private appService: AppService,
    ) {}

    ngOnInit(): void {
        this.backendQueryApiService
            .getUserBalance()
            .subscribe(({ balances }) => {
                balances = balances.filter(item => item.coin === ECoins.HTR);

                this.coins = balances.map(item => item.coin);

                if (this.coins.length > 0) {
                    this.onCurrentCoinChange(this.coins[0]);
                }
            });
    }

    formatPower(source: number): string {
        const value = source / 1000000000;

        return isNaN(value) ? "" : value.toFixed(3);
    }

    formatDiff(source: number): string {
        return String(source / 1000000) + " M";
    }

    formatDate(source: number): string {
        const date = new Date(source * 1000);

        date.setDate(date.getDate() - 1);

        return date.toLocaleDateString();
    }

    private onCurrentCoinChange(coin: ECoins): void {
        this.appService.user.subscribe(user => {
            this.backendQueryApiService
                .getUserStatsHistory({
                    coin,
                    timeFrom: user.registrationDate,
                    groupByInterval: 60 * 60 * 24,
                })
                .subscribe(({ stats }) => {
                    stats.pop();
                    stats.reverse();

                    this.statsHistory = stats;
                });
        });

        // this.backendQueryApiService
        //     .getUserStatsHistory({
        //         coin,
        //     })
        //     .subscribe(({ stats }) => {
        //         console.log(stats);
        //     });
    }
}
