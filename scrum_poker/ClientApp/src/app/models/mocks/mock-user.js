"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
/* This is the TypeScript equivalent of the backend's User class */
var MockUser = /** @class */ (function () {
    function MockUser(username, isAdmin) {
        if (isAdmin === void 0) { isAdmin = false; }
        this.id = uuid_1.v4();
        this.name = username;
        this.selectedCard = -1;
        this.missingInAction = false;
        this.isAdmin = isAdmin;
    }
    return MockUser;
}());
exports.MockUser = MockUser;
//# sourceMappingURL=mock-user.js.map