const ErrorTypeStrings = ["info", "warning", "error"] as const;
export class CompXError extends Error {
    private errorType: typeof ErrorTypeStrings[number];
    private compxStack?: CompXError;

    static fromJSON(d: Object): CompXError {
        const tmpD = d as any;
        if (Array.isArray(d) || !("errorType" in tmpD && "title" in tmpD && "message" in tmpD) ||
                !ErrorTypeStrings.includes(tmpD['errorType']) ||
                typeof tmpD['title'] !== 'string' ||  typeof tmpD['message'] !== 'string'
        ) throw new Error("Cannot serialize into CompXError Component");

        const err = new CompXError(tmpD['errorType'], tmpD['title'], tmpD['message']);
        if ("stack" in tmpD) err.compxStack = CompXError.fromJSON(tmpD['stack']);

        return err;
    }

    constructor(errorType: typeof ErrorTypeStrings[number], name: string, message: string) {
        super(message);
        Object.setPrototypeOf(this, CompXError.prototype);

        this.errorType = errorType;
        this.name = name;
        this.message = message;
    }

    public AddToStack(err: CompXError) {
        const tmpErr: CompXError = Object.assign({}, this);
        this.errorType = err.errorType;
        this.name = err.name;
        this.message = err.message;
        this.compxStack = tmpErr;
    }
}