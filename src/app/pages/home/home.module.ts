import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppSharedModule } from "app.shared.module";

import { routes } from "./home.routes";

import { HomeComponent } from "./home.component";

@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(routes)],
    declarations: [HomeComponent],
})
export class HomeModule {}
