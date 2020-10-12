import { Injectable } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

@Injectable({ providedIn: "root" })
export class LangService {
    onChange = new BehaviorSubject<zpLangController.ELang>(
        zpLangController.getCurrentLang(),
    );

    constructor(private translateService: TranslateService) {}

    changeLang(lang: zpLangController.ELang): void {
        zpLangController.changeLang(lang, () => {
            this.translateService.use(lang);
            this.onChange.next(lang);
        });
    }
}
