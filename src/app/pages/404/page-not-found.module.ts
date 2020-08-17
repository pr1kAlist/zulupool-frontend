import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppSharedModule } from "app.shared.module";

import { routes } from "./page-not-found.routes";

import { PageNotFoundComponent } from "./page-not-found.component";

@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(routes)],
    declarations: [PageNotFoundComponent],
})
export class PageNotFoundModule {}
