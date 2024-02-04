/**
 * Class to manage the conversion from/to bigint to/from number.
 */
export default class ConversionUtils {

    // Number of decimal used to deal with the float number in the smart contract
    public static _nbDecimal : bigint = BigInt(18);

    /**
     * From number to BigInt
     * @param amount number
     * @returns bigint
     */
    public static to(amount : number) : bigint {
        return BigInt(amount*10**Number(this._nbDecimal));
    }

    /**
     * From bigint to number.
     * @param amount bigint
     * @returns number
     */
    public static from(amount : bigint) : number {
        return Number(amount/(BigInt(10)**this._nbDecimal));
    }
}