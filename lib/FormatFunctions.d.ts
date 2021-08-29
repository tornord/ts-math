export declare const smartRound: (d: number, minDecimals?: number, maxDecimals?: number, returnNumberOfdecimals?: boolean) => number;
export declare function numberFormat(v: number, formatStringOrNumberOfDecimals: string, decimalDelimiter?: string, thousandDelimiter?: string, factor?: number, suffix?: string): string;
export declare const valueFormat: (d: number) => string;
export declare const priceFormat: (d: number) => string;
export declare const numberFormatFun: (f: string) => (d: number) => string;
export declare const twoDecPriceFormat: (d: number) => string;
export declare const fourDecPriceFormat: (d: number) => string;
export declare const pctfmtFun: (d: number) => string;
export declare const jsonfmtFun: (d: number) => string;
