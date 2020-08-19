import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { EAppRoutes } from "enums/app-routes";
import { AuthGuard } from "guards/auth.guard";

import { LayoutComponent } from "components/layout/layout.component";

import { HomeComponent } from "pages/home/home.component";
import { SignInComponent } from "pages/sign-in/sign-in.component";
import { SignUpComponent } from "pages/sign-up/sign-up.component";
import { MonitoringComponent } from "pages/monitoring/monitoring.component";
import { PaymentsComponent } from "pages/payments/payments.component";
import { PageNotFoundComponent } from "pages/404/page-not-found.component";

const routes: Routes = [
    {
        path: EAppRoutes.Home,
        pathMatch: "full",
        component: HomeComponent,
    },
    {
        path: EAppRoutes.SignIn,
        component: SignInComponent,
    },
    {
        path: EAppRoutes.SigUp,
        component: SignUpComponent,
    },
    {
        path: "",
        component: LayoutComponent,
        children: [
            {
                path: EAppRoutes.Monitoring,
                component: MonitoringComponent,
            },
            {
                path: EAppRoutes.Payments,
                component: PaymentsComponent,
            },
            {
                path: "**",
                component: PageNotFoundComponent,
            },
        ],
        canActivate: [AuthGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
