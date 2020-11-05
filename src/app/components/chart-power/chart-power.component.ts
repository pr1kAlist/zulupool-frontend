import { Component, Input, OnChanges } from "@angular/core";
import { formatDate } from "@angular/common";

import { Label } from "ng2-charts";

import { IWorkerStatsItem } from "interfaces/backend-query";
import { LangService } from "services/lang.service";

@Component({
    selector: "app-chart-power",
    templateUrl: "./chart-power.component.html",
    styles: [":host { display: block }"],
})
export class ChartPowerComponent implements OnChanges {
    @Input()
    stats: IWorkerStatsItem[];

    @Input()
    powerMultLog10: number;

    labels: Label[];
    data: number[];

    constructor(private langService: LangService) {}

    ngOnChanges(): void {
        this.labels = [];
        this.data = [];

        const stats = [...this.stats];
        const rate = Math.pow(10, 15 - this.powerMultLog10);

        //        stats.pop();
        //var counter: number = 2;
        stats.forEach(item => {
            //const nextLabel = n => !(n % 2);
            this.data.push(item.power / rate);
            //if (!nextLabel(counter)) {
            this.labels.push(
                formatDate(
                    new Date(item.time * 1000),
                    "HH:mm",
                    this.langService.getCurrentLang(),
                ),
            );
            //} else {
            //this.labels.push('');
            //}
            //counter++;
        });
    }
}
