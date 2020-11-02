import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, of } from "rxjs";
import {
    map,
    catchError,
    tap,
    switchMap,
    filter,
    finalize,
} from "rxjs/operators";
import { not } from "logical-not";

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
                    map(({ users }) => {
                        userStore.next({
                            role: ERole.SuperUser,
                            users,
                            ...user,
                        });

                        this.setUpTargetLogin(users);
                    }),
                    catchError(() => {
                        userStore.next({
                            role: ERole.User,
                            ...user,
                        });

                        this.storageService.targetLogin = null;

                        return of(void 0);
                    }),
                );
            }),
            catchError(error => {
                this.reset();

                throw error;
            }),
        );
    }

    logOut(): Observable<void> {
        return this.authApiService.logOut().pipe(
            tap(() => {
                this.reset();
            }),
        );
    }

    getUser(): IUser | null {
        return userStore.value;
    }

    private init(): void {
        const initialSessionId = this.storageService.sessionId;

        if (not(initialSessionId)) {
            userStore.next(null);

            this.isReady.next(true);
        } else {
            this.authorize(initialSessionId)
                .pipe(
                    finalize(() => {
                        this.isReady.next(true);
                    }),
                )
                .subscribe();
        }
    }

    private setUpTargetLogin(users: IUser[]): void {
        const { targetLogin } = this.storageService;

        if (targetLogin && users.some(user => user.login === targetLogin)) {
            return;
        }

        if (users.length > 0) {
            this.storageService.targetLogin = users[0].login;
        }
    }

    private reset(): void {
        this.storageService.sessionId = null;
        this.storageService.targetLogin = null;

        userStore.next(null);
    }
}
