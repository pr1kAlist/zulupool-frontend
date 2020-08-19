import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BaseModule } from "modules/base.module";

import { routes } from "./page-not-found.routes";

import { PageNotFoundComponent } from "./page-not-found.component";

@NgModule({
    imports: [BaseModule, RouterModule.forChild(routes)],
    declarations: [PageNotFoundComponent],
})
export class PageNotFoundModule {}
