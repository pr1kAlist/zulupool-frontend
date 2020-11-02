import { Component, OnInit } from "@angular/core";

import { EAppRoutes, userRootRoute } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import {
    IPoolStatsItem,
    IFoundBlock,
    IWorkerStatsItem,
    IPoolCoinsItem,
} from "interfaces/backend-query";
import { ESuffix } from "pipes/suffixify.pipe";
//import { ETime } from "enums/time";


@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.less"],
})
export class HomeComponent implements OnInit {
    readonly EAppRoutes = EAppRoutes;
    readonly ESuffix = ESuffix;

    poolStatsHistory = {
        stats: [] as IWorkerStatsItem[],
        powerMultLog10: 0,
    };
    poolStatsHistoryAdvanced = [{
        statName: "" as string,
        stats: [] as IWorkerStatsItem[],
        powerMultLog10: 0,
    }];

    poolStatsList: IPoolStatsItem[] = [];
    poolStats: IPoolStatsItem;
    poolCoinsList: IPoolCoinsItem[];
    poolCoin: IPoolCoinsItem;

    foundBlocks: IFoundBlock[];
    foundBlocksLoading = false;
    foundBlockKeys: (keyof IFoundBlock)[] = [
        "foundBy",
        "hash",
        "generatedCoins",
        "confirmations",
        "height",
        "time",
    ];

    signUpLink = {
        href: `/${EAppRoutes.Auth}`,
        params: {
            to: decodeURIComponent(`/${userRootRoute}`),
            registration: true,
        },
    };

    constructor(private backendQueryApiService: BackendQueryApiService) { }

    ngOnInit(): void {

        this.backendQueryApiService
            .getPoolCoins()
            .subscribe(({ poolCoins }) => {
                poolCoins.push({ name: poolCoins[0].algorithm, fullName: poolCoins[0].algorithm, algorithm: poolCoins[0].algorithm })
                this.poolCoinsList = poolCoins;
                this.poolCoin = poolCoins[poolCoins.length - 1];
                this.getCoinStats(this.poolCoin.name);
            });
    }

    onPoolStatsSelect(): void {
        this.getFoundBlocks();
    }
    private getCoinStats(coinName: string): void {
        this.backendQueryApiService.getPoolStats({ coin: coinName }).subscribe(({ stats }) => {
            if (stats.length > 0) {
                this.poolStats = stats[0];
                this.getCoinStatsHistory(coinName, stats[0]);
            }
        });
    }
    private getCoinStatsHistory(coinName: string, liveStats: IPoolStatsItem): void {
        this.backendQueryApiService.getPoolStatsHistory({ coin: coinName }).subscribe(({ stats, powerMultLog10, currentTime }) => {
            if (stats.length > 0) {
                const lastStatTime = stats[stats.length - 1].time;
                if (currentTime < lastStatTime) {
                    stats[stats.length - 1].time = liveStats.lastShareTime;
                    stats[stats.length - 1].power = liveStats.power;
                }
                if (stats.length > 2) stats.shift();
                this.poolStatsHistory = { stats, powerMultLog10 };
            }
        });
    }

    private getFoundBlocks(): void {
        if (this.poolCoin.name !== 'sha256') {
            this.foundBlocksLoading = true;
            this.backendQueryApiService
                .getFoundBlocks({ coin: this.poolCoin.name })
                .subscribe(
                    ({ blocks }) => {
                        this.foundBlocks = blocks;
                        this.foundBlocksLoading = false;
                    },
                    () => {
                        this.foundBlocks = [];
                        this.foundBlocksLoading = false;
                    },
                );
        }
        this.getCoinStats(this.poolCoin.name);
        //this.backendQueryApiService
        //.getPoolStatsHistory({ coin: this.poolCoin.name })
        //.subscribe(({ stats, powerMultLog10 }) => {
        //this.poolStatsHistory = { stats, powerMultLog10 };
        //});
    }
}
