import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, of } from "rxjs";
import { map, catchError, tap, switchMap, filter } from "rxjs/operators";

import { UserApiService } from "api/user.api";
import { AuthApiService } from "api/auth.api";
import { IUser } from "interfaces/user";
import { StorageService } from "services/storage.service";
import { ERole } from "enums/role";

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
        private authApiService: AuthApiService,
        private storageService: StorageService,
    ) {
        this.init();
    }

    authorize(sessionId: string): Observable<void> {
        return this.userApiService.getUser(sessionId).pipe(
            switchMap<IUser, Observable<void>>(user => {
                this.storageService.sessionId = sessionId;

                return this.userApiService.getUserList().pipe(
                    map(() => {
                        userStore.next({
                            role: ERole.Admin,
                            ...user,
                        });
                    }),
                    catchError(() => {
                        userStore.next({
                            role: ERole.User,
                            ...user,
                        });

                        return of(void 0);
                    }),
                );
            }),
            catchError(error => {
                this.storageService.sessionId = null;

                userStore.next(null);

                throw error;
            }),
        );
    }

    logOut(): Observable<void> {
        return this.authApiService.logOut().pipe(
            tap(() => {
                this.storageService.sessionId = null;

                userStore.next(null);
            }),
        );
    }

    getUser(): IUser | null {
        return userStore.value;
    }

    private init(): void {
        const initialSessionId = this.storageService.sessionId;

        this.userApiService.getUser(initialSessionId).subscribe(
            user => {
                this.userApiService.getUserList().subscribe(
                    () => {
                        userStore.next({
                            role: ERole.Admin,
                            ...user,
                        });
                        this.isReady.next(true);
                    },
                    () => {
                        userStore.next({
                            role: ERole.User,
                            ...user,
                        });
                        this.isReady.next(true);
                    },
                );
            },
            () => {
                this.storageService.sessionId = null;

                userStore.next(null);
                this.isReady.next(true);
            },
        );
    }
}
