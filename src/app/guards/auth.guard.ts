import { Injectable } from "@angular/core";
import {
    CanActivate,
    Router,
    UrlTree,
    RouterStateSnapshot,
} from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(_, state: RouterStateSnapshot): true | UrlTree {
        const isAuthenticated = false;

        return isAuthenticated
            ? true
            : this.router.parseUrl(`sign-in?to=${state.url}`);
    }
}
