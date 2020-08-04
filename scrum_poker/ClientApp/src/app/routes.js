"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var home_component_1 = require("./components/home/home.component");
var room_component_1 = require("./components/room/room.component");
var error_page_component_1 = require("./components/error-page/error-page.component");
exports.routes = [
    { path: '', component: home_component_1.HomeComponent, pathMatch: 'full' },
    { path: 'room', component: room_component_1.RoomComponent },
    { path: 'error', component: error_page_component_1.ErrorPageComponent },
    { path: ':rid', component: home_component_1.HomeComponent }
];
//# sourceMappingURL=routes.js.map