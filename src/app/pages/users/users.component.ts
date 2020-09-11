import { Component, OnInit } from "@angular/core";

import { UserApiService } from "api/user.api";
import { IUser } from "interfaces/user";

@Component({
    selector: "app-users-page",
    templateUrl: "./users.component.html",
})
export class UsersComponent implements OnInit {
    users: IUser[];

    constructor(private userApiService: UserApiService) {}

    ngOnInit(): void {
        this.userApiService.getUserList().subscribe(({ users }) => {
            this.users = users;
        });
    }

    onUserClick(user: IUser): void {}
}
