import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class ThemeService {
    chartsColor = new BehaviorSubject<[number, number, number]>(
        zpThemeController.getChartsColor(),
    );
}
