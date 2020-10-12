import { Injectable } from "@angular/core";
import { registerLocaleData } from "@angular/common";

import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

import { langs } from "tools/langs";

@Injectable({ providedIn: "root" })
export class LangService {
    onChange = new BehaviorSubject<zpLangController.ELang>(
        zpLangController.getCurrentLang(),
    );

    constructor(private translateService: TranslateService) {}

    changeLang(lang: zpLangController.ELang): void {
        zpLangController.changeLang(lang, () => {
            registerLocaleData(langs[lang], lang);

            this.translateService.use(lang);
            this.onChange.next(lang);
        });
    }
}
