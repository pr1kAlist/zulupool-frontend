import { Component, OnInit } from "@angular/core";

import { EAppRoutes } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import { ECoins } from "enums/coins";
import { IWorkerStatsItem } from "interfaces/backend-query";
import { AppService } from "services/app.service";
import { ESuffixifyPipeSuffix } from "pipes/suffixify.pipe";
import { ETime } from "enums/time";

@Component({
    selector: "app-payments",
    templateUrl: "./payments.component.html",
    styleUrls: ["./payments.component.less"],
})
export class PaymentsComponent implements OnInit {
    readonly EAppRoutes = EAppRoutes;
    readonly ESuffixifyPipeSuffix = ESuffixifyPipeSuffix;

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

    private onCurrentCoinChange(coin: ECoins): void {
        this.appService.user.subscribe(user => {
            this.backendQueryApiService
                .getUserStatsHistory({
                    coin,
                    timeFrom: user.registrationDate,
                    groupByInterval: ETime.Day,
                })
                .subscribe(({ stats }) => {
                    stats.pop();
                    stats.reverse();

                    this.statsHistory = stats;
                });
        });
    }
}
