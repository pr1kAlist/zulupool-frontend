import { Pipe, PipeTransform } from "@angular/core";

export enum ESuffixifyPipeSuffix {
    M = "M",
    ShareRate = "ShareRate",
    PowerPeta = "PowerPeta",
}

export interface ISuffixifyPipeSettings {
    suffix: ESuffixifyPipeSuffix;
    toFixed?: number;
}

const suffixMap = {
    [ESuffixifyPipeSuffix.M]: "M",
    [ESuffixifyPipeSuffix.ShareRate]: "share/s",
    [ESuffixifyPipeSuffix.PowerPeta]: "Ph/s",
};

@Pipe({ name: "suffixify" })
export class SuffixifyPipe implements PipeTransform {
    transform(
        source: any,
        { suffix, toFixed }: ISuffixifyPipeSettings,
    ): string | any {
        if (typeof source !== "number") return source;

        switch (suffix) {
            case ESuffixifyPipeSuffix.M:
                source /= 1e6;
                break;
            case ESuffixifyPipeSuffix.PowerPeta:
                source /= 1e9;
                break;
        }

        const stringifyed = stringifyNumber(source, toFixed);

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
