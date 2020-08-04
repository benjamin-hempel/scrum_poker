"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var rxjs_1 = require("rxjs");
var ActivatedRouteStub = /** @class */ (function () {
    function ActivatedRouteStub(initialParams) {
        this.subject = new rxjs_1.ReplaySubject();
        this.paramMap = this.subject.asObservable();
        this.setParamMap(initialParams);
    }
    ActivatedRouteStub.prototype.setParamMap = function (params) {
        this.subject.next(router_1.convertToParamMap(params));
    };
    return ActivatedRouteStub;
}());
exports.ActivatedRouteStub = ActivatedRouteStub;
//# sourceMappingURL=activated-route-stub.js.map