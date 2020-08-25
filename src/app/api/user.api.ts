import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";
import { not } from "logical-not";

import { RestService } from "services/rest.service";
import { IUser } from "interfaces/user";

@Injectable({
    providedIn: "root",
})
export class UserApiService {
    constructor(private rest: RestService) {}

    getUser(sessionId: string): Observable<IUser | null> {
        if (not(sessionId)) return of(null);

        return this.rest.post(`/userGetCredentials`, { id: sessionId });
    }

    createUser(user: IUserCreateParams): Observable<any> {
        return this.rest.post("/user", user);
    }

    resendEmail(params: IUserResendEmailParams): Observable<void> {
        return this.rest.post("/userResendEmail", params);
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
