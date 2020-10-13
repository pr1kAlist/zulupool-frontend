import { Injectable } from "@angular/core";
import { registerLocaleData } from "@angular/common";

import ru from "@angular/common/locales/ru";
import en from "@angular/common/locales/en";
// import zh from "@angular/common/locales/zh-Hans";

import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable } from "rxjs";

const { ELang } = zpLangController;

const langs = {
    [ELang.Ru]: ru,
    [ELang.En]: en,
    // [ELang.China]: zh,
};

const currentLang = zpLangController.getCurrentLang();

@Injectable({ providedIn: "root" })
export class LangService {
    onChange = new BehaviorSubject<zpLangController.ELang>(currentLang);

    constructor(private translateService: TranslateService) {
        this.applyLang(currentLang);
    }

    getCurrentLang(): zpLangController.ELang {
        return zpLangController.getCurrentLang();
    }

    changeLang(lang: zpLangController.ELang): void {
        zpLangController.changeLang(lang, () => {
            this.applyLang(lang).subscribe(() => {
                this.onChange.next(lang);
            });
        });
    }

    private applyLang(lang: zpLangController.ELang): Observable<any> {
        registerLocaleData(langs[lang], lang);

        return this.translateService.use(lang);
    }
}
