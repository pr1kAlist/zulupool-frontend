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

    coins: ECoins[];
    currentCoin: ECoins;

    balanceItemList: IUserBalanceItem[];
    userStatsItem: IUserStatsItem;
    userWorkersStatsList: IUserStatsWorker[];

    chart: IChartSettings;

    // temp
    miningBalance: number;

    constructor(private backendQueryApiService: BackendQueryApiService) {}

    ngOnInit(): void {
        this.backendQueryApiService
            .getUserBalance()
            .subscribe(({ balances }) => {
                balances = balances.filter(item => item.coin === ECoins.HTR);

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

                this.userWorkersStatsList.sort((a, b) => {
                    return a.lastShareTime - b.lastShareTime;
                });
            });

        this.backendQueryApiService
            .getUserStatsHistory({ coin })
            .subscribe(({ stats }) => {
                // TODO: уточнить Mining Balance
                this.miningBalance = 0;
                stats.forEach(item => {
                    const date = new Date(item.time * 1000);
                    const today = new Date().getDate();

                    if (date.getDate() === today && date.getHours()) {
                        this.miningBalance += item.shareWork;
                    }
                });

                stats.pop();

                this.updateChart(stats, "#17dc6f", "#4c5e54");
            });
    }

    formatPower(source: number): string {
        const value = source / 1000000000;

        return isNaN(value) ? "" : value.toFixed(3);
    }

    onWorkerRowClick(workerId: string): void {
        this.backendQueryApiService
            .getWorkerStatsHistory({
                coin: this.currentCoin,
                workerId,
                groupByInterval: 15 * 60,
            })
            .subscribe(({ stats }) => {
                stats.pop();

                this.updateChart(stats, "#3331c7", "#7473c5");
            });
    }

    getWorkerState(time: number): EWorkerState {
        const delta = Date.now() - time * 1000;

        if (delta > 30 * 60 * 1000) {
            return EWorkerState.Error;
        }

        if (delta > 15 * 60 * 1000) {
            return EWorkerState.Warning;
        }

        return EWorkerState.Normal;
    }

    formatToTime(time: number): string {
        const delta = new Date(Date.now() - time * 1000);

        return `${format(delta.getMinutes())}:${format(delta.getSeconds())}`;

        function format(source: number) {
            return source < 10 ? "0" + source : String(source);
        }
    }

    private updateChart(
        stats,
        borderColor: string,
        backgroundColor: string,
    ): void {
        const shareRateData = [];
        const powerData = [];
        const dateLabels = [];

        stats.forEach(item => {
            shareRateData.push(item.shareRate);
            powerData.push(item.power / 1000000000);

            dateLabels.push(
                new Date(item.time * 1000)
                    .toLocaleTimeString()
                    .replace(/:00$/, ""),
            );
        });

        this.chart = {
            datasets: [
                // {
                //     label: "ShareRate (Shares/s)",
                //     yAxisID: "ShareRate",
                //     data: shareRateData,
                //     lineTension: 0,
                // },
                {
                    label: "Power (Th/s)",
                    yAxisID: "Power",
                    data: powerData,
                    borderColor,
                    backgroundColor,
                },
            ],
            labels: dateLabels,
            options: {
                scales: {
                    yAxes: [
                        // {
                        //     id: "ShareRate",
                        //     type: "linear",
                        //     position: "right",
                        //     ticks: {
                        //         min: 0,
                        //     },
                        // },
                        {
                            id: "Power",
                            type: "linear",
                            position: "left",
                            ticks: {
                                min: 0,
                            },
                            gridLines: {
                                lineWidth: 1,
                                color: "#333",
                            },
                        },
                    ],
                },
            },
        };
    }
}

interface IChartSettings {
    datasets: ChartDataSets[];
    labels: Label[];
    options: ChartOptions;
}
