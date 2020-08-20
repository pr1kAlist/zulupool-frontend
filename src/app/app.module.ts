import { NgModule } from "@angular/core";

import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import {
    FundProjectionScreenOutline,
    WalletOutline,
    LeftCircleOutline,
    RightCircleOutline,
} from "@ant-design/icons-angular/icons";

import { ChartsModule } from "ng2-charts";

import { PageNotFoundComponent } from "pages/404/page-not-found.component";
import { HomeComponent } from "pages/home/home.component";
import { MonitoringComponent } from "pages/monitoring/monitoring.component";
import { PaymentsComponent } from "pages/payments/payments.component";
import { SignInComponent } from "pages/sign-in/sign-in.component";
import { SignUpComponent } from "pages/sign-up/sign-up.component";

import { FooterComponent } from "components/footer/footer.component";
import { LayoutComponent } from "components/layout/layout.component";
import { LogoComponent } from "components/logo/logo.component";

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
        NzIconModule.forRoot([
            FundProjectionScreenOutline,
            WalletOutline,
            LeftCircleOutline,
            RightCircleOutline,
        ]),

        ChartsModule,
    ],

    declarations: [
        AppComponent,

        PageNotFoundComponent,
        HomeComponent,
        MonitoringComponent,
        PaymentsComponent,
        SignInComponent,
        SignUpComponent,

        FooterComponent,
        LayoutComponent,
        LogoComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
