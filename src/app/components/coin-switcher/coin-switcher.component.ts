import { Component, OnInit } from "@angular/core";
import { StorageService } from "../../services/storage.service";
import { CoinSwitchService } from "../../services/coinswitch.service";
import { ICoinsList, TCoinName } from "../../interfaces/coin";
import { IPoolCoinsItem } from "../../interfaces/backend-query";
import { BackendQueryApiService } from "api/backend-query.api";
import { not } from '@angular/compiler/src/output/output_ast';


@Component({
    selector: "app-coin-switcher",
    templateUrl: "./coin-switcher.component.html",
    styleUrls: ["./coin-switcher.component.less"],
})
export class CoinSwitcherComponent implements OnInit {

    get getCurrentCoinName(): TCoinName | null {
        return this.activeCoinName as TCoinName;
    }

    get getCoinsList(): IPoolCoinsItem[] | null {
        return this.poolCoins as IPoolCoinsItem[];
    }

    //    public currentCoin = <TCoinName>"";
    //public coinsList = <ICoinsList[]>[];
    public activeCoinName = <TCoinName>"";
    public poolCoinsName = <TCoinName[]>[];
    public poolCoins = <IPoolCoinsItem[]>[];

    constructor(
        private storageService: StorageService = {} as StorageService,
        private service: CoinSwitchService = {} as CoinSwitchService,
        private backendQueryApiService: BackendQueryApiService = {} as BackendQueryApiService
    ) { }

    /*onCurrentCoinChange(coin: TCoinName): void {
        this.storageService.currentCoin = coin;
    }*/
    ngOnInit(): void {
        if (this.storageService.currentCoin === null || this.storageService.currentCoin === null || 111 === 111) {
            this.asyncGetCoinsList().then((poolCoins: IPoolCoinsItem[]) => {
                if (poolCoins.length > 0) {
                    this.storageService.currentCoin = poolCoins[poolCoins.length - 1] as IPoolCoinsItem;
                    this.storageService.poolCoins = poolCoins as IPoolCoinsItem[];
                    this.initCoins();
                }
            });
        } else {
            this.initCoins();
        }
    }
    private initCoins(): void {
        const currentCoin = this.storageService.currentCoin || <IPoolCoinsItem>{};
        const coinsList = this.storageService.poolCoins || <IPoolCoinsItem[]>[];
        this.activeCoinName = currentCoin.name;
        this.poolCoinsName = coinsList.map(item => item.name);;
        this.poolCoins = coinsList;
        this.cangeCoin(this.activeCoinName)

    }

    public cangeCoin(newCoin: TCoinName) {
        this.service.setCoin(newCoin);
    }

    private asyncGetCoinsList(): any {
        var promise = new Promise((resolve) => {
            this.backendQueryApiService
                .getPoolCoins()
                .subscribe(({ coins }) => {
                    if (coins.length >= 2) {
                        coins.push({ name: coins[0].algorithm, fullName: coins[0].algorithm, algorithm: coins[0].algorithm })
                    }
                    resolve(coins);
                });
        });
        return promise;
    }
}
