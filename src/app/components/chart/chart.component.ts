import { Component, Input, OnInit, OnChanges, ViewChild } from "@angular/core";

import { ChartDataSets, ChartOptions } from "chart.js";
import { Label, BaseChartDirective } from "ng2-charts";

import { TranslateService } from "@ngx-translate/core";
import { SubscribableComponent } from "ngx-subscribable";
import { not } from "logical-not";

import { LangService } from "services/lang.service";
import { ThemeService } from "services/theme.service";

@Component({
    selector: "app-chart",
    templateUrl: "./chart.component.html",
    styleUrls: ["./chart.component.less"],
})
export class ChartComponent extends SubscribableComponent
    implements OnInit, OnChanges {
    @Input()
    titleKey: string;

    @Input()
    labels: Label[];

    @Input()
    data: number[];

    @ViewChild(BaseChartDirective)
    chartDirective: BaseChartDirective;

    chart: IChartSettings;

    constructor(
        private translateService: TranslateService,
        private langService: LangService,
        private themeService: ThemeService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions.push(
            this.langService.onChange.subscribe(() => {
                if (this.titleKey && this.chartDirective) {
                    const { chart } = this.chartDirective;

                    chart.config.data.datasets[0].label = this.translateService.instant(
                        this.titleKey,
                    );

                    chart.update();
                }
            }),
            this.themeService.chartsColor.subscribe(() => {
                this.ngOnChanges();
            }),
        );
    }

    ngOnChanges(): void {
        const { titleKey: title, labels, data } = this;

        if (not(data?.length > 0)) return;

        const [r, g, b] = this.themeService.chartsColor.value;

        this.chart = {
            datasets: [
                {
                    label: this.translateService.instant(title),
                    data,
                    borderColor: `rgb(${r}, ${g}, ${b})`,
                    backgroundColor: `rgba(${r}, ${g}, ${b}, .3)`,
                    pointBackgroundColor: "rgba(0,0,0,0)",
                    pointBorderColor: "rgba(0,0,0,0)",
                },
            ],
            labels,
            options: {
                scales: {
                    xAxes: [
                        {
                            gridLines: {
                                color: this.themeService.gridLinesColorX,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                color: this.themeService.gridLinesColorY,
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
