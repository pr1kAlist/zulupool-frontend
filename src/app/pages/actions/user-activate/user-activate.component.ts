import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";
import { NzMessageService } from "ng-zorro-antd/message";

import { userRootRoute, EAppRoutes } from "enums/routing";
import { AppService } from "services/app.service";

@Component({
    template: "",
})
export class UserActivateComponent implements OnInit {
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private appService: AppService,
        private nzMessageService: NzMessageService,
        private translateService: TranslateService,
    ) {}

    ngOnInit(): void {
        const { id } = this.activatedRoute.snapshot.queryParams;

        this.appService.authorize(id as string).subscribe(
            () => {
                this.nzMessageService.success(
                    this.translateService.instant(
                        "actions.useractivate.success",
                    ),
                );

                this.router.navigate([userRootRoute]);
            },
            () => {
                this.nzMessageService.error(
                    this.translateService.instant("actions.useractivate.error"),
                );

                this.router.navigate([EAppRoutes.Auth]);
            },
        );
    }
}
