import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { ETheme } from "enums/theme";

@Injectable({ providedIn: "root" })
export class ThemeService {
    theme = new BehaviorSubject<ETheme>(ETheme.Dark);
}
