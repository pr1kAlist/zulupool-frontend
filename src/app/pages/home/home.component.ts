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
        this.backendQueryApiService.getPoolStats().subscribe(response => {
            console.log(response);

            this.poolStatsList = response.stats;

            if (this.poolStatsList.length > 0) {
                this.poolStats = this.poolStatsList[0];

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
            .subscribe(response => {
                console.log(response);

                this.foundBlocks = response.blocks;
                this.foundBlocksLoading = false;
            });
    }

    // ...

    chartOptions: ChartOptions = {
        responsive: true,
    };
    chartLabels = ["1", "2", "3", "4", "5", "6", "7"];
    chartType: ChartType = "line";
    chartLegend = true;
    chartData: ChartDataSets[] = [
        {
            lineTension: 0,
            data: [65, 59, 80, 81, 56, 55, 40],
            label: "Series A",
        },
        {
            lineTension: 0,
            data: [28, 48, 40, 19, 86, 27, 90],
            label: "Series B",
        },
    ];
}
