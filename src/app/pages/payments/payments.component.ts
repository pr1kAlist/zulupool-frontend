import { Component } from "@angular/core";

import { EAppRoutes } from "enums/app-routes";

@Component({
    selector: "app-payments",
    templateUrl: "./payments.component.html",
})
export class PaymentsComponent {
    readonly EAppRoutes = EAppRoutes;
}
