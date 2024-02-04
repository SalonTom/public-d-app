export default class ConversionUtils {
    public static _nbDecimal : bigint = BigInt(18);

    public static to(amount : number) : bigint {
        return BigInt(amount*10**Number(this._nbDecimal));
    }

    public static from(amount : bigint) : number {
        return Number(amount/(BigInt(10)**this._nbDecimal));
    }
}