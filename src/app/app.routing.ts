import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "guards/auth.guard";

const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        loadChildren: () =>
            import("pages/home/home.module").then(m => m.HomeModule),
    },
    {
        path: "sing-in",
        loadChildren: () =>
            import("pages/sign-in/sign-in.module").then(m => m.SignInModule),
    },
    {
        path: "sing-up",
        loadChildren: () =>
            import("pages/sign-up/sign-up.module").then(m => m.SignUpModule),
    },
    {
        path: "**",
        loadChildren: () =>
            import("pages/404/page-not-found.module").then(
                m => m.PageNotFoundModule,
            ),
        canActivate: [AuthGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
