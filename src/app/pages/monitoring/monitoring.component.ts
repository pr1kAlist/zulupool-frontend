import { Component, OnInit } from "@angular/core";

import { ChartDataSets, ChartOptions } from "chart.js";
import { Label } from "ng2-charts";

import { EAppRoutes } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import { ECoins } from "enums/coins";
import {
    IUserBalanceItem,
    IUserStatsItem,
    IUserStatsWorker,
} from "interfaces/backend-query";

@Component({
    selector: "app-monitoring",
    templateUrl: "./monitoring.component.html",
    styleUrls: ["./monitoring.component.less"],
})
export class MonitoringComponent implements OnInit {
    readonly EAppRoutes = EAppRoutes;

    coins: ECoins[];
    currentCoin: ECoins;

    balanceItemList: IUserBalanceItem[];
    userStatsItem: IUserStatsItem;
    userWorkersStatsList: IUserStatsWorker[];

    chart: IChartSettings;

    constructor(private backendQueryApiService: BackendQueryApiService) {}

    ngOnInit(): void {
        this.backendQueryApiService
            .getUserBalance()
            .subscribe(({ balances }) => {
                this.coins = balances.map(item => item.coin);
                this.balanceItemList = balances;

                if (this.coins.length > 0) {
                    this.onCurrentCoinChange(this.coins[0]);
                }
            });
    }

    onCurrentCoinChange(coin: ECoins): void {
        this.currentCoin = coin;

        this.backendQueryApiService
            .getUserStats({ coin })
            .subscribe(({ total, workers }) => {
                this.userStatsItem = total;
                this.userWorkersStatsList = workers;
            });

        this.backendQueryApiService
            .getUserStatsHistory({ coin })
            .subscribe(({ stats }) => {
                const shareRateData = [];
                const powerData = [];
                const dateLabels = [];

                stats.forEach(item => {
                    shareRateData.push(item.shareRate);
                    powerData.push(item.power / 1000000000);

                    dateLabels.push(
                        new Date(item.time * 1000).toLocaleString(),
                    );
                });

                this.chart = {
                    datasets: [
                        {
                            label: "ShareRate (Shares/s)",
                            yAxisID: "ShareRate",
                            data: shareRateData,
                            lineTension: 0,
                        },
                        {
                            label: "Power (Th/s)",
                            yAxisID: "Power",
                            data: powerData,
                            lineTension: 0,
                        },
                    ],
                    labels: dateLabels,
                    options: {
                        scales: {
                            yAxes: [
                                {
                                    id: "ShareRate",
                                    type: "linear",
                                    position: "left",
                                    ticks: {
                                        min: 0,
                                    },
                                },
                                {
                                    id: "Power",
                                    type: "linear",
                                    position: "right",
                                    ticks: {
                                        min: 0,
                                    },
                                },
                            ],
                        },
                    },
                };
            });
    }

    formatPower(source: number): string {
        const value = source / 1000000000;

        return isNaN(value) ? "" : value.toFixed(3);
    }
}

interface IChartSettings {
    datasets: ChartDataSets[];
    labels: Label[];
    options: ChartOptions;
}
