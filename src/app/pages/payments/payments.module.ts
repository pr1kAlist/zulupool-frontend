import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BaseModule } from "modules/base.module";
import { LayoutModule } from "modules/layout.module";

import { routes } from "./payments.routes";

import { PaymentsComponent } from "./payments.component";

@NgModule({
    imports: [BaseModule, RouterModule.forChild(routes), LayoutModule],
    declarations: [PaymentsComponent],
})
export class PaymentsModule {}
