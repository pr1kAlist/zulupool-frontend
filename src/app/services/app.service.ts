import { Injectable, EventEmitter } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

import { UserApiService } from "api/user.api";
import { AuthApiService } from "api/auth.api";
import { IUser } from "interfaces/user";
import { StorageService } from "services/storage.service";

@Injectable({
    providedIn: "root",
})
export class AppService {
    readonly isReady = new BehaviorSubject<boolean>(false);
    readonly user = new EventEmitter<IUser | null>();

    constructor(
        private userApiService: UserApiService,
        private authApiService: AuthApiService,
        private storageService: StorageService,
    ) {
        this.init();
    }

    authorize(sessionId: string): Observable<void> {
        return this.userApiService.getUser(sessionId).pipe(
            map(user => {
                this.storageService.sessionId = sessionId;

                this.user.emit(user);
            }),
            catchError(error => {
                this.storageService.sessionId = null;

                this.user.emit(null);

                throw error;
            }),
        );
    }

    logOut(): Observable<void> {
        return this.authApiService.logOut().pipe(
            tap(() => {
                this.storageService.sessionId = null;

                this.user.emit(null);
            }),
        );
    }

    private init(): void {
        const initialSessionId = this.storageService.sessionId;

        this.userApiService.getUser(initialSessionId).subscribe(
            user => {
                this.user.emit(user);
            },
            () => {
                this.storageService.sessionId = null;

                this.user.emit(null);
            },
            () => {
                this.isReady.next(true);
            },
        );
    }
}
