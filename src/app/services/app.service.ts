import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";
import { skip } from "rxjs/operators";

import { UserApiService } from "api/user.api";
import { IUser } from "interfaces/user";

const user = new BehaviorSubject<IUser | null>(null);

@Injectable({
    providedIn: "root",
})
export class AppService {
    readonly user: Observable<IUser | null> = user.pipe(skip(0));

    constructor(private userApiService: UserApiService) {
        this.userApiService.getUser().subscribe(value => user.next(value));
    }
}
