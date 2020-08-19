import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { filter } from "rxjs/operators";

import { StorageService } from "services/storage.service";
import { ThemeService } from "services/theme.service";
import { EAppRoutes } from "enums/app-routes";
import { BaseComponent } from "tools/base.component";
import { trackById, patchTrackIds } from "tools/trackers";
import { toValueArray } from "tools/enum";
import { hasValue } from "tools/has-value";

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

    private readonly appRoutes = toValueArray(EAppRoutes).filter(hasValue);

    select: EAppRoutes;

    sidebarCollapsed = this.storageService.sidebarCollapsed;
    theme = this.themeService.theme;

    get siderTriggerIcon(): string {
        return this.sidebarCollapsed ? "right-circle" : "left-circle";
    }

    constructor(
        private router: Router,
        private location: Location,
        private activatedRoute: ActivatedRoute,
        private storageService: StorageService,
        private themeService: ThemeService,
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

    onLinkClick(event: Event, route: EAppRoutes): void {
        event.preventDefault();

        if (route !== this.select) {
            this.router.navigate([route]);
        }
    }

    onCollapsedChange(collapsed: boolean): void {
        // TODO: fix bug
        // this.storageService.sidebarCollapsed = collapsed;
    }

    private onUrlChange(): void {
        const urlParts = this.location.path().split(/\//);

        const route = urlParts.find(source =>
            this.appRoutes.includes(source),
        ) as EAppRoutes;

        if (route) {
            this.select = route;
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
