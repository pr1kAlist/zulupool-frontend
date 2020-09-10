import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { EAppRoutes, EActionsRoutes } from "enums/routing";

import { AuthGuard } from "guards/auth.guard";

import { MainLayoutComponent } from "components/main-layout/main-layout.component";
import { UserLayoutComponent } from "components/user-layout/user-layout.component";

import { HomeComponent } from "pages/home/home.component";
import { AuthComponent } from "pages/auth/auth.component";
import { MonitoringComponent } from "pages/monitoring/monitoring.component";
import { PaymentsComponent } from "pages/payments/payments.component";
import { PageNotFoundComponent } from "pages/404/page-not-found.component";
import { UserActivateComponent } from "pages/actions/user-activate/user-activate.component";
import { UserResendEmailComponent } from "pages/user-resend-email/user-resend-email.component";
import { HelpComponent } from "pages/help/help.component";
import { UsersComponent } from "pages/users/users.component";

const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: EAppRoutes.Monitoring,
        // component: MainLayoutComponent,
        // children: [
        //     {
        //         path: EAppRoutes.Home,
        //         pathMatch: "full",
        //         component: HomeComponent,
        //     },
        //     {
        //         path: EAppRoutes.Help,
        //         pathMatch: "full",
        //         component: HelpComponent,
        //     },
        // ],
    },
    {
        path: EAppRoutes.Auth,
        component: AuthComponent,
    },
    {
        path: EAppRoutes.UserResendEmail,
        component: UserResendEmailComponent,
    },
    {
        path: EAppRoutes.Actions,
        children: [
            {
                path: EActionsRoutes.UserActivate,
                component: UserActivateComponent,
            },
        ],
    },
    {
        path: EAppRoutes.Help,
        component: HelpComponent,
    },
    {
        path: "",
        component: UserLayoutComponent,
        children: [
            {
                path: EAppRoutes.Monitoring,
                component: MonitoringComponent,
            },
            {
                path: EAppRoutes.History,
                component: PaymentsComponent,
            },
            // {
            //     path: EAppRoutes,
            //     component: UsersComponent,
            // },
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
