import { Component, OnInit } from "@angular/core";

import { ChartType, ChartOptions, ChartDataSets } from "chart.js";

import { EAppRoutes } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import { ECoins } from "enums/coins";
import { IPoolStatsItem, IFoundBlock } from "interfaces/backend-query";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.less"],
})
export class HomeComponent implements OnInit {
    readonly EAppRoutes = EAppRoutes;

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

    get poolStatsPairs(): { name: string; value: any }[] {
        return Object.entries(this.poolStats || {}).map(([name, value]) => ({
            name,
            value,
        }));
    }

    constructor(private backendQueryApiService: BackendQueryApiService) {}

    ngOnInit(): void {
        this.backendQueryApiService.getPoolStats().subscribe(({ stats }) => {
            this.poolStatsList = stats;

            if (stats.length > 0) {
                this.poolStats = stats[0];

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
            .subscribe(({ blocks }) => {
                this.foundBlocks = blocks;
                this.foundBlocksLoading = false;
            });
    }
}
