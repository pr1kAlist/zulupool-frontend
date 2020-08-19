import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BaseModule } from "modules/base.module";
import { LayoutModule } from "modules/layout.module";

import { routes } from "./monitoring.routes";

import { MonitoringComponent } from "./monitoring.component";

@NgModule({
    imports: [RouterModule.forChild(routes), BaseModule, LayoutModule],
    declarations: [MonitoringComponent],
})
export class MonitoringModule {}
