import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable } from "rxjs";
import { skip, tap, catchError, map } from "rxjs/operators";

import { StorageService } from "services/storage.service";
import { not } from "logical-not";

export const OKStatus = "ok";

export interface IResponse {
    status: string;
}

export class InvalidDataError extends Error {}

@Injectable({
    providedIn: "root",
})
export class RestService {
    readonly headers: { [header: string]: string } = {
        accept: "application/json",
        "Content-Type": "application/json",
    };

    readonly sessionId = new BehaviorSubject<string | null>(
        this.storageService.sessionId,
    ).pipe(
        skip(1),
        tap(() => {
            console.log("Session id");
        }),
    );

    constructor(
        private http: HttpClient,
        private storageService: StorageService,
    ) {}

    post<T>(url: string, params: any = {}): Observable<T> {
        const options = { headers: this.headers };

        params = { id: this.storageService.sessionId, ...params };

        if (not(params.id)) {
            delete params.id;
        }

        return this.http.post(createAPIUrl(url), params, options).pipe(
            catchError(error => {
                throw error;
            }),
            tap(response => {
                const { status } = response as IResponse;

                if (status !== OKStatus) {
                    throw new InvalidDataError(status);
                }
            }),
            map(response => {
                delete (response as IResponse).status;

                return response as T;
            }),
        ) as Observable<T>;
    }
}

export function createAPIUrl(url: string): string {
    return `/api${url}`;
}
