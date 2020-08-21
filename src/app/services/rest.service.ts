import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { BehaviorSubject, Observable } from "rxjs";
import { skip, tap, catchError } from "rxjs/operators";

import { StorageService } from "services/storage.service";

export const OKStatus = "ok";

export interface IResponse {
    status: string;
}

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

        return this.http.post(createAPIUrl(url), params, options).pipe(
            catchError(error => {
                return error;
            }),
            tap(response => {
                const { status } = response as IResponse;

                if (status !== OKStatus) {
                    throw new Error(status);
                }
            }),
        ) as Observable<T>;
    }
}

export function createAPIUrl(url: string): string {
    return `/api${url}`;
}
