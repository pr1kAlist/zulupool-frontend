import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { SubscribableComponent } from "ngx-subscribable";

import { EAppRoutes } from "enums/routing";
import { trackById, patchTrackIds } from "tools/trackers";
import { toValueArray } from "tools/enum";
import { hasValue } from "tools/has-value";
import { AppService } from "services/app.service";
import { routeToUrl } from "tools/route-to-url";
import { ERole } from "enums/role";
import { RoleAccessService } from "services/role-access.service";

@Component({
    selector: "app-user-layout",
    templateUrl: "./user-layout.component.html",
    styleUrls: ["./user-layout.component.less"],
})
export class UserLayoutComponent extends SubscribableComponent
    implements OnInit {
    readonly EAppRoutes = EAppRoutes;
    readonly trackById = trackById;

    readonly navigationItems: INavigationItem[] = patchTrackIds([
        {
            route: EAppRoutes.Monitoring,
            title: "components.userLayout.nav.monitoring",
            icon: "fund-projection-screen",
        },
        {
            route: EAppRoutes.History,
            title: "components.userLayout.nav.history",
            icon: "history",
        },
        {
            route: EAppRoutes.Users,
            title: "components.userLayout.nav.users",
            icon: "user",
            access: ERole.SuperUser,
        },
        {
            route: EAppRoutes.Payouts,
            title: "components.userLayout.nav.payouts",
            icon: "wallet",
        },
        {
            route: EAppRoutes.Settings,
            title: "components.userLayout.nav.settings",
            icon: "setting",
        },
    ]);

    private readonly appRoutes = toValueArray(EAppRoutes).filter(hasValue);

    currentRoute: EAppRoutes;

    showMobileNavMenu = false;

    get username(): string {
        return this.appService.getUser().name;
    }

    constructor(
        private router: Router,
        private location: Location,
        private activatedRoute: ActivatedRoute,
        private appService: AppService,
        private roleAccessService: RoleAccessService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.subscriptions = [
            this.router.events
                .pipe(filter(event => event instanceof NavigationEnd))
                .subscribe(() => {
                    this.onUrlChange();
                }),
            this.activatedRoute.url.subscribe(() => {
                this.onUrlChange();
            }),
        ];
    }

    logOut(): void {
        this.appService.logOut().subscribe(() => {
            this.showMobileNavMenu = false;

            this.router.navigate([routeToUrl(EAppRoutes.Home)]);
        });
    }

    hasAccess(role: ERole): Observable<boolean> {
        return this.roleAccessService.hasAccess(role);
    }

    private onUrlChange(): void {
        const urlParts = this.location.path().split(/\//);

        const route = urlParts.find(source =>
            this.appRoutes.includes(source),
        ) as EAppRoutes;

        if (route) {
            this.currentRoute = route;
            this.showMobileNavMenu = false;
        }
    }
}

interface INavigationItem {
    route: EAppRoutes;
    title:
        | "components.userLayout.nav.monitoring"
        | "components.userLayout.nav.payments";
    icon: "fund-projection-screen" | "wallet";
}
