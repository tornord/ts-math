export declare function solveQP(Dmat: number[][], dvec: number[], Amat: number[][], bvec: number[], meq?: number, factorized?: number[]): {
    message: string;
    solution?: undefined;
    Lagrangian?: undefined;
    value?: undefined;
    unconstrainedSolution?: undefined;
    iterations?: undefined;
    iact?: undefined;
} | {
    solution: number[];
    Lagrangian: number[];
    value: number[];
    unconstrainedSolution: number[];
    iterations: number[];
    iact: number[];
    message: string;
};
export declare function base0to1(A: any): any;
export declare function base1to0(A: any): any;
