import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { filter } from "rxjs/operators";

import { EAppRoutes } from "enums/routing";
import { ThemeService } from "services/theme.service";
import { BaseComponent } from "tools/base.component";
import { trackById, patchTrackIds } from "tools/trackers";
import { toValueArray } from "tools/enum";
import { hasValue } from "tools/has-value";
import { AppService } from "services/app.service";
import { routeToUrl } from "tools/route-to-url";

@Component({
    selector: "app-layout",
    templateUrl: "./layout.component.html",
    styleUrls: ["./layout.component.less"],
})
export class LayoutComponent extends BaseComponent implements OnInit {
    readonly EAppRoutes = EAppRoutes;
    readonly trackById = trackById;

    readonly navigationItems: INavigationItem[] = patchTrackIds([
        {
            route: EAppRoutes.Monitoring,
            title: "components.layout.nav.monitoring",
            icon: "fund-projection-screen",
        },
        {
            route: EAppRoutes.Payments,
            title: "components.layout.nav.payments",
            icon: "wallet",
        },
    ]);

    readonly theme = this.themeService.theme;

    private readonly appRoutes = toValueArray(EAppRoutes).filter(hasValue);

    currentRoute: EAppRoutes;

    constructor(
        private router: Router,
        private location: Location,
        private activatedRoute: ActivatedRoute,
        private themeService: ThemeService,
        private appService: AppService,
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
            this.router.navigate([routeToUrl(EAppRoutes.Home)]);
        });
    }

    private onUrlChange(): void {
        const urlParts = this.location.path().split(/\//);

        const route = urlParts.find(source =>
            this.appRoutes.includes(source),
        ) as EAppRoutes;

        if (route) {
            this.currentRoute = route;
        }
    }
}

interface INavigationItem {
    route: EAppRoutes;
    title:
        | "components.layout.nav.monitoring"
        | "components.layout.nav.payments";
    icon: "fund-projection-screen" | "wallet";
}
