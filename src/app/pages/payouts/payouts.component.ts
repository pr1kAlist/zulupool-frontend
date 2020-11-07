import { Component, OnInit } from "@angular/core";

import { UserApiService } from "api/user.api";
import { BackendQueryApiService } from "api/backend-query.api";
import { BackendManualApiService } from "api/backend-manual.api";
import { IUserPayouts } from "interfaces/backend-query";
import { IUserSettings } from "interfaces/user";
import { TCoinName } from "interfaces/coin";

@Component({
    selector: "app-payouts",
    templateUrl: "./payouts.component.html",
    styleUrls: ["./payouts.component.less"],
})
export class PayoutsComponent implements OnInit {
    settings: IUserSettings[];
    selectedIndex: number;

    payouts: IUserPayouts[];
    isPayoutsLoading = false;

    isManualPayoutSending = false;
    currentCoin: TCoinName;

    constructor(
        private userApiService: UserApiService,
        private backendQueryApiService: BackendQueryApiService,
        private backendManualApiService: BackendManualApiService,
    ) { }

    ngOnInit(): void {
        this.userApiService
            .userGetSettings()
            .subscribe(({ coins: settings }) => {
                this.settings = settings;

                if (settings.length > 0) {
                    this.selectedIndex = 0;

                    this.onCurrentCoinChange(this.settings[0].name);
                }
            });
    }

    onCurrentCoinChange(coin: TCoinName): void {
        this.currentCoin = coin;

        this.getUserStat(coin);
        //this.backendQueryApiService
        //.getUserStatsHistory({ coin })
        //.subscribe(({ stats, powerMultLog10 }) => {
        // this.setAcceptedDifficulty(stats);

        //this.userStatsHistory = { stats, powerMultLog10 };
        //});
    }


    getUserStat(coin: TCoinName): void {
        this.isPayoutsLoading = true;

        this.backendQueryApiService.getUserPayouts({ coin }).subscribe(
            ({ payouts }) => {
                this.payouts = payouts;
                this.isPayoutsLoading = false;
            },
            () => {
                this.payouts = [];
                this.isPayoutsLoading = false;
            },
        );
    }

    manualPayout(): void {
        this.isManualPayoutSending = true;

        const { name: coin } = this.settings[this.selectedIndex];

        this.backendManualApiService.forcePayout({ coin }).subscribe(
            () => {
                this.isManualPayoutSending = false;
            },
            () => {
                this.isManualPayoutSending = false;
            },
        );
    }
}
