import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StorageService {
    get sidebarCollapsed(): boolean {
        const source = window.localStorage.getItem("sidebar-collapsed");

        return Boolean(source) || false;
    }

    set sidebarCollapsed(collapsed: boolean) {
        if (collapsed) {
            window.localStorage.setItem("sidebar-collapsed", "true");
        } else {
            window.localStorage.removeItem("sidebar-collapsed");
        }
    }
}
