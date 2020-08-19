import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BaseModule } from "modules/base.module";

import { routes } from "./home.routes";

import { HomeComponent } from "./home.component";

@NgModule({
    imports: [BaseModule, RouterModule.forChild(routes)],
    declarations: [HomeComponent],
})
export class HomeModule {}
