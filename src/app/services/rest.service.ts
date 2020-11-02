import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";

import { StorageService } from "services/storage.service";
import { not } from "logical-not";

export const OKStatus = "ok";

export interface IResponse {
    status?: string;
}

export class InvalidDataError extends Error { }

@Injectable({
    providedIn: "root",
})
export class RestService {
    readonly headers: { [header: string]: string } = {
        accept: "application/json",
        "Content-Type": "application/json",
    };

    constructor(
        private http: HttpClient,
        private storageService: StorageService,
    ) { }

    post<T>(url: string, params: any = {}): Observable<T> {
        const options = { headers: this.headers };

        params = { id: this.storageService.sessionId, ...params };

        if (not(params.id)) {
            delete params.id;
        }

        const { targetLogin } = this.storageService;

        if (targetLogin) {
            params.targetLogin = targetLogin;
        }
        const tmp = url;
        return this.http.post(createAPIUrl(url), params, options).pipe(
            catchError(error => {
                throw error;
            }),
            tap(response => {
                const { status } = response as IResponse;

                if (status !== OKStatus && tmp !== '/backendQueryCoins') {
                    throw new InvalidDataError(status);
                }
            }),
            map(response => {
                delete (response as IResponse).status;
                if (tmp === '/backendQueryCoins') {
                    var tmpCoins = { poolCoins: response };
                    response = tmpCoins;
                }
                return response as T;
            }),
        ) as Observable<T>;
    }
}

export function createAPIUrl(url: string): string {
    return `/api${url}`;
}
