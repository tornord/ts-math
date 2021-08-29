export declare function sum(xs: number[]): number;
export declare function mean(xs: number[]): number;
/**
 * Calculates the standard deviation of samples in the input array
 * ```
 * \operatorname{stdev}(x)=\sqrt{\frac{\sum{x^2}-\frac{\sum{x}}{n}}{n-1}}
 * ```
 */
export declare function stdev(xs: number[]): number;
/**
 * The corr function returns the correlation coefficient of two
 * ```
 * \operatorname{corr}(x,y)=\frac{n\sum{xy}-\sum{x}\sum{y}}{\sqrt{(n\sum{x^2}-(\sum{x})^2)(n\sum{y^2}-(\sum{y})^2)}}
 * ```
 */
export declare function corr(xs: number[], ys: number[]): number;
/**
 * In probability theory and statistics, skewness is a measure of the asymmetry of the probability distribution of a real-valued random
 * variable about its mean.
 */
export declare function skew(xs: number[]): number;
/**
 * In probability theory and statistics, kurtosis (from Greek: κυρτός, kyrtos or kurtos, meaning "curved, arching") is a measure of the
 * "tailedness" of the probability distribution of a real-valued random variable.
 */
export declare function kurtosis(xs: number[]): number;
/**
 * erf is the "error function" encountered in integrating the normal distribution (which is a normalized form of the Gaussian function).
 * It is an entire function defined by
 * ```
 * \operatorname{erf}(z) = \frac{2}{\sqrt{\pi}}\int_{0}^z e^{-t^2}dt
 * ```
 */
export declare function erf(z: number): number;
/**
 * The complementary error function
 */
export declare function erfc(x: number): number;
/**
 * Inverse complementary error function
 */
export declare function erfcinv(p: number): number;
/**
 * Normal inverse cumulative distribution function
 * @param {Number} p Probability
 * @param {Number} mu Mean
 * @param {Number} sigma Standard deviation
 */
export declare function normalInv(p: number, mu: number, sigma: number): number;
/**
 * Normal cumulative distribution function
 * @param {*} x Value
 * @param {*} mu Mean
 * @param {*} sigma Standard deviation
 */
export declare function normalCdf(x: number, mu: number, sigma: number): number;
/**
 * Central weighted standard deviation. Calculates standard deviation on samples. Sorts the samples in ascending order and weights them
 * central weighted. The standard deviation is estimated as linear regression from the QQ-plot. The function is useful when the input
 * data is normal distributed and contains erroneous values (eg. time series data with jumps and spikes).
 */
export declare function centralWeightedStdev(vs: number[]): number;
/**
 * Function that returns the q-th quantile of a dataset (same as numpy.quantile in Python)
 */
export declare function quantile(xs: number[], q: number): number;
/**
 * Rounds with decimals. It should round away from zero, therefore it rounds absolute amount. It also adds a small amount to avoid
 * midpoint rounding issues, like 0.4999999999 should round to 1
 */
export declare function round(x: number, decimals: number): number;
