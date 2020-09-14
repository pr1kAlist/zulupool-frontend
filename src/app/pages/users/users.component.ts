import { Component, OnInit } from "@angular/core";

import { UserApiService } from "api/user.api";
import { IUser } from "interfaces/user";
import { StorageService } from "services/storage.service";
import { Router } from "@angular/router";
import { userRootRoute } from "enums/routing";

@Component({
    selector: "app-users-page",
    templateUrl: "./users.component.html",
})
export class UsersComponent implements OnInit {
    users: IUser[];

    get targetLogin(): string {
        return this.storageService.targetLogin;
    }

    constructor(
        private router: Router,
        private userApiService: UserApiService,
        private storageService: StorageService,
    ) {}

    ngOnInit(): void {
        this.userApiService.getUserList().subscribe(({ users }) => {
            this.users = users;
        });
    }

    onUserClick(user: IUser): void {
        if (user.name !== this.targetLogin) {
            this.storageService.targetLogin = user.name;

            this.router.navigate([userRootRoute]);
        }
    }
}
