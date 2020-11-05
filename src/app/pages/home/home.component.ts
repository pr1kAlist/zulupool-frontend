import { Component, OnInit } from "@angular/core";

import { EAppRoutes, userRootRoute } from "enums/routing";
import { BackendQueryApiService } from "api/backend-query.api";
import {
    IPoolStatsItem,
    IFoundBlock,
    IWorkerStatsItem,
    //   IPoolCoinsItem,
} from "interfaces/backend-query";
import { ESuffix } from "pipes/suffixify.pipe";
import { TCoinName } from "interfaces/coin";
import { CoinSwitchService } from "../../services/coinswitch.service";

//import { global } from '@angular/compiler/src/util';
//import { ETime } from "enums/time";

interface IpoolHistoryInfo {
    stats: IWorkerStatsItem[];
    powerMultLog10: number;
}
interface IcoinInfo {
    stats: IPoolStatsItem;
    statsHistory: IpoolHistoryInfo;
    foundBlocks: IFoundBlock[];
    //    foundBlocksLoading: boolean
}
interface IcoinsInfo {
    [key: string]: IcoinInfo;
}

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.less"],
})
export class HomeComponent implements OnInit {
    readonly EAppRoutes = EAppRoutes;
    readonly ESuffix = ESuffix;

    public coinsList: TCoinName[];
    private coinsData: IcoinsInfo = {};

    public currentCoin: TCoinName;
    public currentAlgo: string = "";
    public currentStats: IPoolStatsItem;
    public currentHistory: IWorkerStatsItem[];
    public currentPowerMultLog10: number;
    public currentBlocks: IFoundBlock[];
    public currentBlocksLoading: boolean = false;

    public explorersLinksPref: {};

    explorersLinksPrefDGB1: "https://chainz.cryptoid.info/dgb/block.dws?";
    explorersLinksPrefDGB2: ".htm";

    private updateTimeoutFastId: number;
    private updateTimeoutSlowId: number;

    public foundBlockKeys: (keyof IFoundBlock)[] = [
        "foundBy",
        "hash",
        "generatedCoins",
        "confirmations",
        "height",
        "time",
    ];

    public signUpLink = {
        href: `/${EAppRoutes.Auth}`,
        params: {
            to: decodeURIComponent(`/${userRootRoute}`),
            registration: true,
        },
    };

    constructor(
        private backendQueryApiService: BackendQueryApiService,
        private service: CoinSwitchService,
    ) {}

    coinSwitch = this.service.coinSwitch;

    ionViewWillLoad() {}

    ngOnInit(): void {
        this.coinSwitch.subscribe(value => {
            this.onCurrentCoinChange(value);
        });
        this.explorersLinksPref = {
            BTC: "https://chainz.cryptoid.info/dgb/block.dws?",
            BCH: "https://blockchair.com/bitcoin-cash/block/",
            BSV: "https://blockchair.com/bitcoin-sv/block/",
            DGB: "https://chainz.cryptoid.info/dgb/block.dws?",
            FCH: "http://fch.world/block/",
            HTR: "https://explorer.hathor.network/transaction/",
            BTC2: ".htm",
            BCH2: "",
            BSV2: "",
            DGB2: ".htm",
            FCH2: "",
            HTR2: "",
        };
        this.asyncGetCoinsList().then(() => {
            this.asyncGetCoinStats(this.currentCoin).then(() => {
                const thisCoinData = this.coinsData[this.currentCoin].stats;
                this.asyncGetCoinStatsHistory(
                    this.currentCoin,
                    thisCoinData,
                ).then(() => {
                    switch (this.currentCoin) {
                        case this.currentAlgo:
                            this.onCurrentCoinChange(this.currentCoin);
                            this.coinsList.forEach(el => {
                                this.inintCoinsData(el);
                            });
                            break;
                        default:
                            this.asyncGetFoundBlocks(this.currentCoin).then(
                                () => {
                                    this.onCurrentCoinChange(this.currentCoin);
                                    this.coinsList.forEach(el => {
                                        this.inintCoinsData(el);
                                    });
                                },
                            );
                            break;
                    }
                    //this.onCurrentCoinChange(this.currentCoin);
                    this.coinsList.forEach(el => {
                        this.asyncGetCoinStats(el).then(() => {
                            const thisCoinData = this.coinsData[el].stats;
                            this.asyncGetCoinStatsHistory(
                                el,
                                thisCoinData,
                            ).then(() => {
                                if (el !== this.currentAlgo)
                                    this.asyncGetFoundBlocks(el);
                            });
                        });
                    });
                });
            });
        });
    }

    ngOnDestroy(): void {
        clearTimeout(this.updateTimeoutFastId);
        clearTimeout(this.updateTimeoutSlowId);
    }

    onCurrentCoinChange(coinName: TCoinName): void {
        this.setCoin(coinName);
        this.periodicFastCall(coinName);
        this.periodicSlowCall(coinName);
    }
    private setCoin(coinName: TCoinName): void {
        this.currentCoin = coinName;
        this.currentStats = this.coinsData[coinName].stats;
        this.currentHistory = this.coinsData[coinName].statsHistory.stats
            ? this.coinsData[coinName].statsHistory.stats
            : [];
        this.currentPowerMultLog10 = this.coinsData[coinName].statsHistory
            .powerMultLog10
            ? this.coinsData[coinName].statsHistory.powerMultLog10
            : 0;
        this.currentBlocks = this.coinsData[coinName].foundBlocks;
        //        this.currentBlocksLoading = this.coinsData[coinName].foundBlocksLoading;
    }

    private fetchNewData(coinName: TCoinName, setCoin: boolean = false) {
        this.asyncGetCoinStats(coinName).then(() => {
            const thisCoinData = this.coinsData[coinName].stats;
            this.asyncGetCoinStatsHistory(coinName, thisCoinData).then(() => {
                if (coinName !== this.currentAlgo) {
                    this.asyncGetFoundBlocks(coinName).then(() => {
                        if (setCoin) this.setCoin(coinName);
                    });
                } else if (setCoin) this.setCoin(coinName);
            });
        });
    }
    private periodicFastCall(coinName: TCoinName) {
        clearTimeout(this.updateTimeoutFastId);
        this.updateTimeoutFastId = setTimeout(() => {
            this.fetchNewData(coinName, true);
            this.periodicFastCall(coinName);
        }, 45 * 1000);
    }

    private periodicSlowCall(coinName: TCoinName) {
        clearTimeout(this.updateTimeoutSlowId);
        this.updateTimeoutSlowId = setTimeout(() => {
            this.coinsList.forEach(coin => {
                if (coin !== this.currentCoin) this.fetchNewData(coin);
            });
            this.periodicSlowCall(coinName);
        }, 3 * 60 * 1000);
    }

    private asyncGetCoinsList(): any {
        var promise = new Promise((resolve, reject) => {
            this.backendQueryApiService
                .getPoolCoins()
                .subscribe(({ coins }) => {
                    if (coins.length >= 2) {
                        coins.push({
                            name: coins[0].algorithm,
                            fullName: coins[0].algorithm,
                            algorithm: coins[0].algorithm,
                        });
                    }
                    this.currentAlgo = coins[0].algorithm;
                    this.coinsList = coins.map(item => item.name);
                    if (this.coinsList.length > 0) {
                        this.currentCoin = this.coinsList.includes(
                            this.currentAlgo,
                        )
                            ? this.currentAlgo
                            : this.coinsList[0];
                        this.coinsList.forEach(el => {
                            this.inintCoinsData(el);
                        });
                    }
                    resolve();
                });
        });
        return promise;
    }
    private asyncGetCoinStats(coinName: TCoinName): any {
        var promise = new Promise((resolve, reject) => {
            this.backendQueryApiService
                .getPoolStats({ coin: coinName })
                .subscribe(({ stats }) => {
                    if (stats.length > 0) {
                        this.addStatsData(coinName, stats[0]);
                    }
                    resolve();
                });
        });
        return promise;
    }
    private asyncGetCoinStatsHistory(
        coinName: TCoinName,
        liveStats: IPoolStatsItem,
    ): any {
        var promise = new Promise((resolve, reject) => {
            let timeFrom =
                ((new Date().valueOf() / 1000) as any).toFixed(0) -
                2 * 24 * 60 * 60;
            let groupByInterval = 60 * 60;
            this.backendQueryApiService
                .getPoolStatsHistory({
                    coin: coinName,
                    timeFrom,
                    groupByInterval,
                })
                .subscribe(({ stats, powerMultLog10, currentTime }) => {
                    if (stats.length > 0) {
                        const lastStatTime = stats[stats.length - 1].time;
                        if (currentTime < lastStatTime) {
                            stats[stats.length - 1].time =
                                liveStats.lastShareTime;
                            stats[stats.length - 1].power = liveStats.power;
                        }
                        if (stats.length > 2) stats.shift();
                        this.addStatsHistoryData(coinName, {
                            stats,
                            powerMultLog10,
                        });
                    }
                    resolve();
                });
        });
        return promise;
    }
    private asyncGetFoundBlocks(coinName: TCoinName) {
        var promise = new Promise((resolve, reject) => {
            if (coinName !== this.currentAlgo) {
                //if (this.currentCoin == coinName) this.currentBlocksLoading = true;
                this.backendQueryApiService
                    .getFoundBlocks({ coin: coinName })
                    .subscribe(
                        ({ blocks }) => {
                            this.addFoundBlocksData(coinName, blocks);
                            //if (this.currentCoin == coinName) this.currentBlocksLoading = false;
                            resolve("Ok");
                        },
                        () => {
                            this.addFoundBlocksData(coinName, []);
                            //if (this.currentCoin == coinName) this.currentBlocksLoading = false;
                            resolve("Ok");
                        },
                    );
            }
            resolve();
        });
        return promise;
    }

    private inintCoinsData(coinName: TCoinName) {
        this.coinsData[coinName] = {
            stats: {} as IPoolStatsItem,
            statsHistory: {} as IpoolHistoryInfo,
            foundBlocks: [],
        };
    }
    private addStatsData(coinName: TCoinName, stats: IPoolStatsItem) {
        this.coinsData[coinName] = {
            stats,
            statsHistory: this.coinsData[coinName].statsHistory,
            foundBlocks: this.coinsData[coinName].foundBlocks,
        };
    }
    private addStatsHistoryData(
        coinName: TCoinName,
        statsHistory: IpoolHistoryInfo,
    ) {
        this.coinsData[coinName] = {
            stats: this.coinsData[coinName].stats,
            statsHistory,
            foundBlocks: this.coinsData[coinName].foundBlocks,
        };
    }
    private addFoundBlocksData(
        coinName: TCoinName,
        foundBlocks: IFoundBlock[],
    ) {
        this.coinsData[coinName] = {
            stats: this.coinsData[coinName].stats,
            statsHistory: this.coinsData[coinName].statsHistory,
            foundBlocks,
        };
    }
}
