'use client';
import { __assign } from "tslib";
import React from 'react';
import * as echarts from 'echarts';
import EChartsReactCore from './core';
// Functional component to export the EChartsReact with echarts object initialization
var EChartsReact = function (props) {
    return React.createElement(EChartsReactCore, __assign({}, props, { echarts: echarts }));
};
export default EChartsReact;
//# sourceMappingURL=index.js.map