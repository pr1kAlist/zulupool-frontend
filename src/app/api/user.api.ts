import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";
import not from "logical-not";

import { RestService } from "services/rest.service";
import { StorageService } from "services/storage.service";
import { IUser } from "interfaces/user";

@Injectable({
    providedIn: "root",
})
export class UserApiService {
    constructor(
        private rest: RestService,
        private storageService: StorageService,
    ) {}

    getUser(): Observable<IUser | null> {
        const id = this.storageService.sessionId;

        if (not(id)) return of(null);

        return this.rest.post(`/userGetCredentials`, { id });
    }

    createUser(user: IUserCreateParams): Observable<any> {
        return this.rest.post("/user/", user);
    }
}

export interface IUserCreateParams {
    login: string;
    password: string;
    email: string;
    name: string;
}
