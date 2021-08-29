export declare enum RandomTimeSeriesPriceType {
    Stock = "Stock",
    Bond = "Bond",
    Index = "Index",
    Swap = "Swap",
    Fx = "Fx",
    Future = "Future"
}
export declare class RandomNumberGenerator {
    constructor(seed: string);
    rng: any;
    rand(): number;
    random(): number;
    randN(): number;
    randomNormal(): number;
    randX(): number;
    randomPoisson(): number;
    randomInt(max: number): number;
    randomSeed(): string;
    randomItem(arr: any[] | string): any;
    randomNames(count: number, minchars?: number, maxchars?: number): string[];
    static longNameToName(n: string): string;
    randomLongNames(count: number, minwords?: number, maxwords?: number): string[];
    randomObjectId(): string;
}
