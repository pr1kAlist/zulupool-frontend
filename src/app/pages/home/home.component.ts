import { Component } from "@angular/core";

import { ChartType, ChartOptions, ChartDataSets } from "chart.js";

import { EAppRoutes } from "enums/routing";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.less"],
})
export class HomeComponent {
    readonly EAppRoutes = EAppRoutes;

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
