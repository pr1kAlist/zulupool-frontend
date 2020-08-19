import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BaseModule } from "modules/base.module";

import { routes } from "./sign-up.routes";

import { SignUpComponent } from "./sign-up.component";

@NgModule({
    imports: [BaseModule, RouterModule.forChild(routes)],
    declarations: [SignUpComponent],
})
export class SignUpModule {}
