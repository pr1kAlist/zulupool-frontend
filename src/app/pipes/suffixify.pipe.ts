import { Pipe, PipeTransform } from "@angular/core";

export enum ESuffixifyPipeSuffix {
    M = "M",
    ShareRate = "ShareRate",
    PowerPeta = "PowerPeta",
    PowerTera = "PowerTera",
    Power = "Power",
}

export interface ISuffixifyPipeSettings {
    suffix: ESuffixifyPipeSuffix;
    toFixed?: number;
    numberMetric?: number;
}

const suffixMap = {
    [ESuffixifyPipeSuffix.M]: "M",
    [ESuffixifyPipeSuffix.ShareRate]: "share/s",
    [ESuffixifyPipeSuffix.PowerPeta]: "Ph/s",
    [ESuffixifyPipeSuffix.PowerTera]: "Th/s",
};

const metricPrefixList = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];

@Pipe({ name: "suffixify" })
export class SuffixifyPipe implements PipeTransform {
    transform(
        source: any,
        { suffix, toFixed, numberMetric = 0 }: ISuffixifyPipeSettings,
    ): string | any {
        if (typeof source !== "number") return source;

        switch (suffix) {
            case ESuffixifyPipeSuffix.M:
                source /= 1e6;
                break;
            case ESuffixifyPipeSuffix.Power:
                // TODO
                for (let i = numberMetric; i < metricPrefixList.length; i++) {
                    if (i === 0) continue;

                    source /= 1000;

                    if (source < 1000) break;
                }
                break;
            case ESuffixifyPipeSuffix.PowerPeta:
                source /= 1e9;
                break;
            case ESuffixifyPipeSuffix.PowerTera:
                if (source / 1e6 > 1000) {
                    return this.transform(source, {
                        suffix: ESuffixifyPipeSuffix.PowerPeta,
                        toFixed,
                    });
                }

                source /= 1e6;
                break;
        }

        const stringifyed = stringifyNumber(source, toFixed);

        if (suffix === ESuffixifyPipeSuffix.Power) {
            return `${stringifyed}\u00a0${metricPrefixList[numberMetric]}h/s`;
        }

        return suffix in suffixMap
            ? `${stringifyed}\u00a0${suffixMap[suffix]}`
            : stringifyed;
    }
}

function stringifyNumber(source: number, toFixed?: number): string {
    return typeof toFixed === "number"
        ? source.toFixed(toFixed)
        : String(source);
}
