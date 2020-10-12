import { Pipe, PipeTransform } from "@angular/core";
import { formatDate } from "@angular/common";

import { Observable } from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import { map } from "rxjs/internal/operators/map";
import { not } from "logical-not";

import { LangService } from "services/lang.service";

@Pipe({ name: "date" })
export class DateXPipe implements PipeTransform {
    constructor(private langService: LangService) {}

    transform(value: any, format = "shortDate"): Observable<string> {
        if (not(value)) return of("");

        return this.langService.onChange.pipe(
            map(() =>
                formatDate(value, format, zpLangController.getCurrentLang()),
            ),
        );
    }
}
