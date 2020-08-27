import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { RestService } from "services/rest.service";
import { ECoins } from "enums/coins";

@Injectable({
    providedIn: "root",
})
export class BackendQueryApiService {
    constructor(private restService: RestService) {}

    forcePayout(params: IForcePayoutParams): Observable<boolean> {
        return this.restService
            .post("/backendManualPayout", params)
            .pipe(
                map((response: IForcePayoutResponse) =>
                    Boolean(response?.result),
                ),
            );
    }
}

export interface IForcePayoutParams {
    coin: ECoins;
}

interface IForcePayoutResponse {
    result: boolean;
}
