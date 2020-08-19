import { Component } from "@angular/core";

import { EAppRoutes } from "enums/app-routes";

@Component({
    selector: "app-monitoring",
    templateUrl: "./monitoring.component.html",
})
export class MonitoringComponent {
    readonly EAppRoutes = EAppRoutes;
}
