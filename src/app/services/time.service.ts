import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class TimeService {
    time = new BehaviorSubject<number>(null);
}
