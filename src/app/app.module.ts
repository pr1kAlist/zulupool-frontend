import { NgModule } from "@angular/core";

import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzModalModule } from "ng-zorro-antd/modal";
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
import { AuthComponent } from "pages/auth/auth.component";

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
        AuthComponent,

        FooterComponent,
        LayoutComponent,
        LogoComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
