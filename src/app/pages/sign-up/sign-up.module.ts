import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppSharedModule } from "app.shared.module";

import { routes } from "./sign-up.routes";

import { SignUpComponent } from "./sign-up.component";

@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(routes)],
    declarations: [SignUpComponent],
})
export class SignUpModule {}
