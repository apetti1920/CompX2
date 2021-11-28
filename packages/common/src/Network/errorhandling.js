"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompXError = void 0;
var ErrorTypeStrings = ["info", "warning", "error"];
var CompXError = /** @class */ (function (_super) {
    __extends(CompXError, _super);
    function CompXError(errorType, name, message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, CompXError.prototype);
        _this.errorType = errorType;
        _this.name = name;
        _this.message = message;
        return _this;
    }
    CompXError.fromJSON = function (d) {
        var tmpD = d;
        if (Array.isArray(d) || !("errorType" in tmpD && "title" in tmpD && "message" in tmpD) ||
            !ErrorTypeStrings.includes(tmpD['errorType']) ||
            typeof tmpD['title'] !== 'string' || typeof tmpD['message'] !== 'string')
            throw new Error("Cannot serialize into CompXError Component");
        var err = new CompXError(tmpD['errorType'], tmpD['title'], tmpD['message']);
        if ("stack" in tmpD)
            err.compxStack = CompXError.fromJSON(tmpD['stack']);
        return err;
    };
    CompXError.prototype.AddToStack = function (err) {
        var tmpErr = Object.assign({}, this);
        this.errorType = err.errorType;
        this.name = err.name;
        this.message = err.message;
        this.compxStack = tmpErr;
    };
    return CompXError;
}(Error));
exports.CompXError = CompXError;
