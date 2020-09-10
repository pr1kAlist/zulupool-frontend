import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";
import { not } from "logical-not";

import { RestService } from "services/rest.service";
import { IUser } from "interfaces/user";

@Injectable({
    providedIn: "root",
})
export class UserApiService {
    constructor(private restService: RestService) {}

    getUser(sessionId: string): Observable<IUser | null> {
        if (not(sessionId)) return of(null);

        return this.restService.post(`/userGetCredentials`, { id: sessionId });
    }

    createUser(user: IUserCreateParams): Observable<any> {
        return this.restService.post("/user", user);
    }

    resendEmail(params: IUserResendEmailParams): Observable<void> {
        return this.restService.post("/userResendEmail", params);
    }

    getUserList(): Observable<IUserListResponse> {
        return this.restService.post("/userEnumerateAll");
    }
}

export interface IUserCreateParams {
    login: string;
    password: string;
    email: string;
    // name: string;
}

export interface IUserResendEmailParams {
    login: string;
    password: string;
    email: string;
}

export interface IUserListResponse {
    users: IUser[];
}
