import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";

import { ChartDataSets, ChartOptions } from "chart.js";
import { Label } from "ng2-charts";

import { EAppRoutes } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import { ECoins } from "enums/coins";
import { IUserStatsItem, IWorkerStatsItem } from "interfaces/backend-query";
import { ESuffixifyPipeSuffix } from "pipes/suffixify.pipe";

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
    readonly ESuffixifyPipeSuffix = ESuffixifyPipeSuffix;

    coins: ECoins[];
    currentCoin: ECoins;

    userStatsItem: IUserStatsItem;
    userStatsHistory: IWorkerStatsItem[];
    userWorkersStatsList: IWorkerStatsItem[];

    chart: IChartSettings;

    acceptedDifficulty: number;

    constructor(
        private backendQueryApiService: BackendQueryApiService,
        private datePipe: DatePipe,
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
                this.acceptedDifficulty = 0;

                const today = new Date().getDate();

                stats.forEach(item => {
                    const date = new Date(item.time * 1000);

                    if (date.getDate() === today && date.getHours()) {
                        this.acceptedDifficulty += item.shareWork;
                    }
                });

                stats.pop();

                this.userStatsHistory = stats;

                this.updateChart(stats);
            });
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

                this.updateChart(stats, { r: 23, g: 220, b: 111 });

                window.scroll(0, 0);
            });
    }

    showUserStatsHistoryChart(): void {
        this.updateChart(this.userStatsHistory);
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

    private updateChart(
        stats: IWorkerStatsItem[],
        { r, g, b }: { r: number; g: number; b: number } = {
            r: 23,
            g: 125,
            b: 220,
        },
    ): void {
        const data = [];
        const labels = [];

        stats.forEach(item => {
            data.push(item.power / 1e9);

            labels.push(
                this.datePipe.transform(new Date(item.time * 1000), "hh:mm"),
            );
        });

        this.chart = {
            datasets: [
                {
                    label: "Power (Th/s)",
                    data,
                    borderColor: `rgb(${r}, ${g}, ${b})`,
                    backgroundColor: `rgba(${r}, ${g}, ${b}, .3)`,
                },
            ],
            labels,
            options: {},
        };
    }
}

interface IChartSettings {
    datasets: ChartDataSets[];
    labels: Label[];
    options: ChartOptions;
}
