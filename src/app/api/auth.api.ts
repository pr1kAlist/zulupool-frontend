import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { RestService } from "services/rest.service";
import { IUser } from "interfaces/user";

@Injectable({
    providedIn: "root",
})
export class AuthApiService {
    constructor(private rest: RestService) {}

    sigIn(params: IAuthSignInParams): Observable<IUser> {
        return this.rest.post(`/userLogin`, params);
    }

    signUp(user: IUserCreateParams): Observable<any> {
        return this.rest.post("/userCreate", user);
    }

    logOut(): any {}
}

export interface IAuthSignInParams {
    login: string;
    password: string;
}

export interface IUserCreateParams {}
