import { Component } from "@angular/core";

import { EAppRoutes } from "enums/routing";

@Component({
    selector: "app-monitoring",
    templateUrl: "./monitoring.component.html",
})
export class MonitoringComponent {
    readonly EAppRoutes = EAppRoutes;
}
