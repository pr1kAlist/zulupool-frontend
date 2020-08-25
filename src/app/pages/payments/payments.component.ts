import { Component } from "@angular/core";

import { EAppRoutes } from "enums/routing";

@Component({
    selector: "app-payments",
    templateUrl: "./payments.component.html",
})
export class PaymentsComponent {
    readonly EAppRoutes = EAppRoutes;
}
