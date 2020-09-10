import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

import { ERole } from "enums/role";
import { AppService } from "services/app.service";

@Injectable({
    providedIn: "root",
})
export class RoleAccessService {
    constructor(private appService: AppService) {}

    hasAccess(role: ERole): Observable<boolean> {
        switch (role) {
            case ERole.Admin:
                return this.appService.user.pipe(
                    map(user => {
                        return user?.role === ERole.Admin;
                    }),
                );
            default:
                return of(true);
        }
    }
}
