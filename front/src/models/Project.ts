export default class Project {
    public owner: string;
    public title: string;
    public description: string;
    public initialValuation: bigint;
    public symbol: string;
    public initialTokenNumber: bigint;

    constructor(
        owner?: string,
        title?: string,
        description?: string,
        symbol?: string,
        initialValuation?: bigint,
        initialTokenNumber?: bigint
    ) {
        this.owner = owner ?? '';
        this.title = title ?? '';
        this.description = description ?? '';
        this.initialValuation = initialValuation ?? BigInt(0);
        this.symbol = symbol ?? '';
        this.initialTokenNumber = initialTokenNumber ?? BigInt(1);
    }
}