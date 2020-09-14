import { Component } from "@angular/core";
import { StorageService } from "services/storage.service";

@Component({
    selector: "app-target-login-badge",
    templateUrl: "./target-login-badge.component.html",
    styleUrls: ["./target-login-badge.component.less"],
})
export class TargetLoginBadgeComponent {
    get targetLogin(): string | null {
        return this.storageService.targetLogin;
    }

    constructor(private storageService: StorageService) {}
}
