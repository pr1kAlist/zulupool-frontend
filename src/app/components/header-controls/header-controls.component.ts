import { Component } from "@angular/core";

import { ThemeService } from "services/theme.service";

@Component({
    selector: "app-header-controls",
    templateUrl: "./header-controls.component.html",
    styleUrls: ["./header-controls.component.less"],
})
export class HeaderControlsComponent {
    readonly themeList = zpThemeController.getThemeList();

    currentTheme = zpThemeController.getCurrentTheme();

    constructor(private themeService: ThemeService) {}

    changeTheme(theme: zpThemeController.ETheme): void {
        zpThemeController.changeTheme(theme, () => {
            this.themeService.chartsColor.next(
                zpThemeController.getChartsColor(),
            );
        });
    }
}
