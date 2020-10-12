import { Component } from "@angular/core";

import { LangService } from "services/lang.service";
import { ThemeService } from "services/theme.service";

@Component({
    selector: "app-header-controls",
    templateUrl: "./header-controls.component.html",
    styleUrls: ["./header-controls.component.less"],
})
export class HeaderControlsComponent {
    readonly ELang = zpLangController.ELang;

    readonly langList = zpLangController.getLangList();
    readonly themeList = zpThemeController.getThemeList();

    currentLang = zpLangController.getCurrentLang();
    currentTheme = zpThemeController.getCurrentTheme();

    constructor(
        private langService: LangService,
        private themeService: ThemeService,
    ) {}

    changeLang(lang: zpLangController.ELang): void {
        this.langService.changeLang(lang);

        this.currentLang = lang;
    }

    changeTheme(theme: zpThemeController.ETheme): void {
        this.themeService.changeTheme(theme);

        this.currentTheme = theme;
    }
}
