"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var echarts = tslib_1.__importStar(require("echarts"));
var core_1 = tslib_1.__importDefault(require("./core"));
// Functional component to export the EChartsReact with echarts object initialization
var EChartsReact = function (props) {
    return react_1.default.createElement(core_1.default, tslib_1.__assign({}, props, { echarts: echarts }));
};
exports.default = EChartsReact;
//# sourceMappingURL=index.js.map