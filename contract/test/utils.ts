const DECIMALS: bigint = 18n;
/// Converts a number to a blockchain representation of the float
/// @param value The number to convert
/// @returns A float represented as an integer
const toBlockchainFloat = (value: number) => BigInt(value * (10 **Number(DECIMALS)));
/// Converts a blockchain representation of a float to a number
/// @param value The blockchain representation of the float
/// @returns The actual float
const fromBlockchainFloat = (value: bigint) => BigInt(value) / (10n ** DECIMALS);

export { toBlockchainFloat, fromBlockchainFloat };