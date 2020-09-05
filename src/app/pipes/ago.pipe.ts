import { Pipe, PipeTransform } from "@angular/core";
import { I18nPluralPipe } from "@angular/common";

import { ETime } from "enums/time";
import { createTimestamp } from "tools/date";

@Pipe({ name: "ago" })
export class AgoPipe implements PipeTransform {
    constructor(private i18nPluralPipe: I18nPluralPipe) {}

    transform(time: any): string | any {
        if (typeof time !== "number") return time;

        const s = time % ETime.Minute;
        const m = Math.floor(time / ETime.Minute) % ETime.Minute;
        const h = Math.floor(time / ETime.Hour) % 24;
        const d = Math.floor(time / ETime.Day);

        const parts: any[] = [];

        if (d > 0) {
            parts.push(d);
            parts.push(
                this.i18nPluralPipe.transform(d, {
                    "=1": "день",
                    "=2": "дня",
                    other: "дней",
                }),
            );
        }

        if (h) {
            parts.push(h);
            parts.push(
                this.i18nPluralPipe.transform(h, {
                    "=1": "час",
                    "=2": "часа",
                    other: "часов",
                }),
            );
        }

        if (m) {
            parts.push(m);
            parts.push(
                this.i18nPluralPipe.transform(m, {
                    "=1": "минута",
                    "=2": "минуты",
                    other: "минут",
                }),
            );
        }

        parts.push(s);
        parts.push(
            this.i18nPluralPipe.transform(s, {
                "=1": "секунда",
                "=2": "секунды",
                other: "секунд",
            }),
        );

        return parts.join(" ");
    }
}
