import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, of } from "rxjs";
import { filter, map, catchError, tap } from "rxjs/operators";

import { UserApiService } from "api/user.api";
import { IUser } from "interfaces/user";
import { StorageService } from "services/storage.service";

const undefined = void 0;
const userStore = new BehaviorSubject<IUser | null>(undefined);

@Injectable({
    providedIn: "root",
})
export class AppService {
    readonly isReady = new BehaviorSubject<boolean>(false);
    readonly user = userStore.pipe(filter(value => value !== undefined));

    constructor(
        private userApiService: UserApiService,
        private storageService: StorageService,
    ) {
        this.init();
    }

    authorize(sessionId: string): Observable<void> {
        return this.userApiService.getUser(sessionId).pipe(
            map(user => {
                this.storageService.sessionId = sessionId;

                userStore.next(user);
            }),
            catchError(error => {
                this.storageService.sessionId = null;

                throw error;
            }),
        );
    }

    logOut(): Observable<void> {
        return of(undefined).pipe(
            tap(() => {
                this.storageService.sessionId = null;

                userStore.next(null);
            }),
        );
    }

    private init(): void {
        const initialSessionId = this.storageService.sessionId;

        this.userApiService.getUser(initialSessionId).subscribe(
            value => userStore.next(value),
            () => {
                this.storageService.sessionId = null;

                userStore.next(null);
            },
            () => {
                this.isReady.next(true);
            },
        );
    }
}
