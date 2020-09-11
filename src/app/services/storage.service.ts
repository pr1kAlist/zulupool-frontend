import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StorageService {
    get sessionId(): string | null {
        return window.localStorage.getItem("sid") || null;
    }

    set sessionId(sessionId: string | null) {
        if (sessionId) {
            window.localStorage.setItem("sid", sessionId);
        } else {
            window.localStorage.removeItem("sid");
        }
    }

    get targetLogin(): string | null {
        return window.localStorage.getItem("target") || null;
    }

    set targetLogin(target: string | null) {
        if (target) {
            window.localStorage.setItem("target", target);
        } else {
            window.localStorage.removeItem("target");
        }
    }
}
