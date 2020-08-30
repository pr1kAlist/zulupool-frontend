import { NgModule } from "@angular/core";

import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

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
import {
    FundProjectionScreenOutline,
    WalletOutline,
    LeftCircleOutline,
    RightCircleOutline,
    LoadingOutline,
    QuestionCircleOutline,
    CheckCircleOutline,
    ExclamationCircleOutline,
    MinusCircleOutline,
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

import { FooterComponent } from "components/footer/footer.component";
import { MainLayoutComponent } from "components/main-layout/main-layout.component";
import { UserLayoutComponent } from "components/user-layout/user-layout.component";
import { LogoComponent } from "components/logo/logo.component";
import { EmptyContentComponent } from "components/empty-content/empty-content.component";

import { AppRoutingModule } from "app.routing";
import { AppComponent } from "app.component";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(
        http,
        "/assets/i18n/",
        `.json?v=${Date.now()}`,
    );
}

export const defaultLanguage = "ru";

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
        NzIconModule.forRoot([
            FundProjectionScreenOutline,
            WalletOutline,
            LeftCircleOutline,
            RightCircleOutline,
            LoadingOutline,
            QuestionCircleOutline,
            CheckCircleOutline,
            ExclamationCircleOutline,
            MinusCircleOutline,
        ]),

        ChartsModule,
    ],

    providers: [
        {
            provide: NZ_CONFIG,
            useValue: {
                empty: {
                    nzDefaultEmptyContent: EmptyContentComponent,
                },
            },
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

        FooterComponent,
        MainLayoutComponent,
        UserLayoutComponent,
        LogoComponent,
        EmptyContentComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
