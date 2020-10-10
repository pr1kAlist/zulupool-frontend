import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DatePipe, I18nPluralPipe, registerLocaleData } from "@angular/common";

import ru from "@angular/common/locales/ru";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { NZ_CONFIG } from "ng-zorro-antd/core/config";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzModalModule } from "ng-zorro-antd/modal";
import { NzMessageModule } from "ng-zorro-antd/message";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzAlertModule } from "ng-zorro-antd/alert";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import {
    FundProjectionScreenOutline,
    LeftCircleOutline,
    RightCircleOutline,
    LoadingOutline,
    QuestionCircleOutline,
    CheckCircleOutline,
    ExclamationCircleOutline,
    MinusCircleOutline,
    HistoryOutline,
    MenuOutline,
    UserOutline,
    WalletOutline,
    SettingOutline,
} from "@ant-design/icons-angular/icons";

import { ChartsModule } from "ng2-charts";

import { PageNotFoundComponent } from "pages/404/page-not-found.component";
import { HomeComponent } from "pages/home/home.component";
import { MonitoringComponent } from "pages/monitoring/monitoring.component";
import { PaymentsComponent } from "pages/payments/payments.component";
import { AuthComponent } from "pages/auth/auth.component";
import { UserActivateComponent } from "pages/actions/user-activate/user-activate.component";
import { UserResendEmailComponent } from "pages/user-resend-email/user-resend-email.component";
import { HelpComponent } from "pages/help/help.component";
import { UsersComponent } from "pages/users/users.component";
import { PayoutsComponent } from "pages/payouts/payouts.component";
import { SettingsComponent } from "pages/settings/settings.component";

import { FooterComponent } from "components/footer/footer.component";
import { MainLayoutComponent } from "components/main-layout/main-layout.component";
import { UserLayoutComponent } from "components/user-layout/user-layout.component";
import { LogoComponent } from "components/logo/logo.component";
import { EmptyContentComponent } from "components/empty-content/empty-content.component";
import { TargetLoginBadgeComponent } from "components/target-login-badge/target-login-badge.component";
import { ChartComponent } from "components/chart/chart.component";
import { ChartPowerComponent } from "components/chart-power/chart-power.component";
import { HeaderControlsComponent } from "components/header-controls/header-controls.component";

import { AgoPipe } from "pipes/ago.pipe";
import { MetricPrefixifyPipe } from "pipes/metric-prefixify.pipe";
import { SecondsPipe } from "pipes/seconds.pipe";
import { SuffixifyPipe } from "pipes/suffixify.pipe";
import { ToFixedPipe } from "pipes/to-fixed.pipe";
import { AcceptedDifficultyPipe } from "pipes/accepted-difficulty.pipe";

import { AppRoutingModule } from "app.routing";
import { AppComponent } from "app.component";
import { from } from "rxjs";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(
        http,
        "/assets/i18n/",
        `.json?v=${Date.now()}`,
    );
}

export const defaultLanguage = "ru";

registerLocaleData(ru);

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        TranslateModule,
        TranslateModule.forRoot({
            defaultLanguage,
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),

        NzLayoutModule,
        NzMenuModule,
        NzToolTipModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzTabsModule,
        NzModalModule,
        NzMessageModule,
        NzSpinModule,
        NzTableModule,
        NzSelectModule,
        NzRadioModule,
        NzDrawerModule,
        NzDropDownModule,
        NzAlertModule,
        NzSwitchModule,
        NzTypographyModule,
        NzIconModule.forRoot([
            FundProjectionScreenOutline,
            LeftCircleOutline,
            RightCircleOutline,
            LoadingOutline,
            QuestionCircleOutline,
            CheckCircleOutline,
            ExclamationCircleOutline,
            MinusCircleOutline,
            HistoryOutline,
            MenuOutline,
            UserOutline,
            WalletOutline,
            SettingOutline,
        ]),

        ChartsModule,
    ],

    providers: [
        { provide: LOCALE_ID, useValue: "ru" },
        {
            provide: NZ_CONFIG,
            useValue: {
                empty: {
                    nzDefaultEmptyContent: EmptyContentComponent,
                },
            },
        },
        {
            provide: I18nPluralPipe,
        },
        {
            provide: DatePipe,
        },
    ],

    declarations: [
        AppComponent,

        PageNotFoundComponent,
        HomeComponent,
        MonitoringComponent,
        PaymentsComponent,
        AuthComponent,
        UserActivateComponent,
        UserResendEmailComponent,
        HelpComponent,
        UsersComponent,
        PayoutsComponent,
        SettingsComponent,

        FooterComponent,
        MainLayoutComponent,
        UserLayoutComponent,
        LogoComponent,
        EmptyContentComponent,
        TargetLoginBadgeComponent,
        ChartComponent,
        ChartPowerComponent,
        HeaderControlsComponent,

        AgoPipe,
        MetricPrefixifyPipe,
        SecondsPipe,
        SuffixifyPipe,
        ToFixedPipe,
        AcceptedDifficultyPipe,
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
