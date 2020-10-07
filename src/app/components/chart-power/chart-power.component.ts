import { Component, Input, OnChanges } from "@angular/core";
import { DatePipe } from "@angular/common";

import { Label } from "ng2-charts";

import { IWorkerStatsItem } from "interfaces/backend-query";

@Component({
    selector: "app-chart-power",
    templateUrl: "./chart-power.component.html",
    styles: [":host { display: block }"],
})
export class ChartPowerComponent implements OnChanges {
    @Input()
    stats: IWorkerStatsItem[];

    @Input()
    powerMultLog10 = 6;

    labels: Label[];
    data: number[];

    constructor(private datePipe: DatePipe) {}

    ngOnChanges(): void {
        this.labels = [];
        this.data = [];

        const stats = [...this.stats];
        const rate = Math.pow(10, 15 - this.powerMultLog10);

        stats.pop();

        stats.forEach(item => {
            this.data.push(item.power / rate);

            this.labels.push(
                this.datePipe.transform(new Date(item.time * 1000), "HH:mm"),
            );
        });
    }
}
