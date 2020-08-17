import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AppSharedModule } from "app.shared.module";

import { routes } from "./sign-in.routes";

import { SignInComponent } from "./sign-in.component";

@NgModule({
    imports: [AppSharedModule, RouterModule.forChild(routes)],
    declarations: [SignInComponent],
})
export class SignInModule {}
