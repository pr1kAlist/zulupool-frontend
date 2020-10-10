import { Component, OnInit } from "@angular/core";

import { EAppRoutes, userRootRoute } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import {
    IPoolStatsItem,
    IFoundBlock,
    IWorkerStatsItem,
} from "interfaces/backend-query";
import { ESuffix } from "pipes/suffixify.pipe";

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

    poolStatsList: IPoolStatsItem[];
    poolStats: IPoolStatsItem;

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

    constructor(private backendQueryApiService: BackendQueryApiService) {}

    ngOnInit(): void {
        this.backendQueryApiService
            .getPoolStatsHistory({ coin: "HTR" })
            .subscribe(({ stats, powerMultLog10 }) => {
                this.poolStatsHistory = { stats, powerMultLog10 };
            });

        this.backendQueryApiService.getPoolStats().subscribe(({ stats }) => {
            this.poolStatsList = stats;

            if (stats.length > 0) {
                this.poolStats = stats.find(item => {
                    return item.coin === "HTR";
                });

                this.getFoundBlocks();
            }
        });
    }

    onPoolStatsSelect(): void {
        this.getFoundBlocks();
    }

    private getFoundBlocks(): void {
        this.foundBlocksLoading = true;

        this.backendQueryApiService
            .getFoundBlocks({ coin: this.poolStats.coin })
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

        this.backendQueryApiService
            .getPoolStatsHistory({ coin: this.poolStats.coin })
            .subscribe(({ stats, powerMultLog10 }) => {
                this.poolStatsHistory = { stats, powerMultLog10 };
            });
    }
}
