import { Injectable } from "@angular/core";
import { ICoinsList, TCoinName } from "interfaces/coin";
import { IUser } from "interfaces/user";
import { IPoolCoinsItem } from "interfaces/backend-query";

@Injectable({ providedIn: "root" })
export class StorageService {
    get sessionId(): string | null {
        return window.localStorage.getItem("sessionId") || null;
    }

    set sessionId(sessionId: string | null) {
        if (sessionId) window.localStorage.setItem("sessionId", sessionId);
        else window.localStorage.removeItem("sessionId");
    }

    get targetLogin(): string | null {
        return window.localStorage.getItem("targetLogin") || null;
    }

    set targetLogin(targetLogin: string | null) {
        if (targetLogin)
            window.localStorage.setItem("targetLogin", targetLogin);
        else window.localStorage.removeItem("targetLogin");
    }

    get currentCoin(): IPoolCoinsItem | null {
        return JSON.parse(window.localStorage.getItem("currentCoin")) || null;
    }
    set currentCoin(currentCoin: IPoolCoinsItem | null) {
        if (currentCoin)
            window.localStorage.setItem(
                "currentCoin",
                JSON.stringify(currentCoin),
            );
        else window.localStorage.removeItem("currentCoin");
    }

    get currentUser(): string | null {
        return window.localStorage.getItem("currentUser") || null;
    }
    set currentUser(currentUser: string | null) {
        if (currentUser)
            window.localStorage.setItem("currentUser", currentUser);
        else window.localStorage.removeItem("currentUser");
    }

    get poolCoins(): IPoolCoinsItem[] | null {
        return JSON.parse(window.localStorage.getItem("poolCoins")) || null;
    }
    set poolCoins(poolCoins: IPoolCoinsItem[] | null) {
        if (poolCoins)
            window.localStorage.setItem("poolCoins", JSON.stringify(poolCoins));
        else window.localStorage.removeItem("poolCoins");
    }

    get userSettings(): {} | null {
        return JSON.parse(window.localStorage.getItem("userSettings")) || null;
    }
    set userSettings(userSettings: {} | null) {
        if (userSettings)
            window.localStorage.setItem(
                "userSettings",
                JSON.stringify(userSettings),
            );
        else window.localStorage.removeItem("userSettings");
    }

    get userCredentials(): {} | null {
        return window.localStorage.getItem("userCredentials") || null;
    }
    set userCredentials(userCredentials: {} | null) {
        if (userCredentials)
            window.localStorage.setItem(
                "userCredentials",
                JSON.stringify(userCredentials),
            );
        else window.localStorage.removeItem("userCredentials");
    }
}
