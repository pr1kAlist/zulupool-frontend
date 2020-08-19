import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BaseModule } from "modules/base.module";

import { routes } from "./sign-in.routes";

import { SignInComponent } from "./sign-in.component";

@NgModule({
    imports: [BaseModule, RouterModule.forChild(routes)],
    declarations: [SignInComponent],
})
export class SignInModule {}
