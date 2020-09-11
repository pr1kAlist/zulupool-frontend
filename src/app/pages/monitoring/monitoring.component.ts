import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";

import { ChartDataSets, ChartOptions } from "chart.js";
import { Label } from "ng2-charts";

import { EAppRoutes } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import { ECoins } from "enums/coins";
import { IUserStatsItem, IWorkerStatsItem } from "interfaces/backend-query";
import { ESuffix } from "pipes/suffixify.pipe";
import { EPowerUnit } from "enums/power-unit";

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
    readonly ESuffix = ESuffix;

    coins: ECoins[];
    currentCoin: ECoins;

    userStatsItem: IUserStatsItem;
    userStatsItemZeroUnitsOffset: number;
    userStatsHistory: IWorkerStatsItem[];
    userWorkersStatsList: IWorkerStatsItem[];

    chart: IChartSettings;

    acceptedDifficulty: string;

    powerNumberMetric = 0;

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
            .subscribe(({ total, workers, currentTime, powerMultLog10 }) => {
                workers.forEach(item => {
                    item.lastShareTime = currentTime - item.lastShareTime;
                });

                this.userStatsItem = total;
                this.userStatsItemZeroUnitsOffset = powerMultLog10;
                this.userWorkersStatsList = workers;

                this.userWorkersStatsList.sort((a, b) => {
                    return b.lastShareTime - a.lastShareTime;
                });
            });

        this.backendQueryApiService
            .getUserStatsHistory({ coin })
            .subscribe(({ stats, powerMultLog10, powerUnit }) => {
                if (powerUnit === EPowerUnit.Hash) {
                    this.powerNumberMetric = powerMultLog10 / 3;
                }

                this.setAcceptedDifficulty(stats);

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
            .subscribe(({ stats, currentTime }) => {
                const last = stats[stats.length - 1];

                last.time -= last.time - currentTime;

                this.updateChart(stats, { r: 23, g: 220, b: 111 });

                window.scroll(0, 0);
            });
    }

    showUserStatsHistoryChart(): void {
        this.updateChart(this.userStatsHistory);
    }

    getWorkerState(time: number): EWorkerState {
        if (time > 30 * 60) {
            return EWorkerState.Error;
        }

        if (time > 15 * 60) {
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
                    label: "Power (Ph/s)",
                    data,
                    borderColor: `rgb(${r}, ${g}, ${b})`,
                    backgroundColor: `rgba(${r}, ${g}, ${b}, .3)`,
                    pointRadius: 8,
                    pointBackgroundColor: "rgba(0,0,0,0)",
                    pointBorderColor: "rgba(0,0,0,0)",
                },
            ],
            labels,
            options: {},
        };
    }

    private setAcceptedDifficulty(stats: IWorkerStatsItem[]): void {
        let acceptedDifficulty = 0;

        const today = new Date().getDate();

        stats.forEach(item => {
            const date = new Date(item.time * 1000);

            if (date.getDate() === today && date.getHours()) {
                acceptedDifficulty += item.shareWork;
            }
        });

        const asString = (acceptedDifficulty / 1e6).toFixed(3);

        // const asString = parseFloat(
        //     (acceptedDifficulty / 1e6).toFixed(3),
        // ).toLocaleString();

        this.acceptedDifficulty = `${asString} M`;
    }
}

interface IChartSettings {
    datasets: ChartDataSets[];
    labels: Label[];
    options: ChartOptions;
}
