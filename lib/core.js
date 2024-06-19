"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var size_sensor_1 = require("size-sensor");
var pick_1 = require("./helper/pick");
var is_function_1 = require("./helper/is-function");
var is_string_1 = require("./helper/is-string");
var is_equal_1 = require("./helper/is-equal");
/**
 * core component for echarts binding
 */
var EChartsReactCore = function (props) {
    'use client';
    var echarts = props.echarts, shouldSetOption = props.shouldSetOption, theme = props.theme, opts = props.opts, onEvents = props.onEvents, onChartReady = props.onChartReady, option = props.option, _a = props.notMerge, notMerge = _a === void 0 ? false : _a, _b = props.lazyUpdate, lazyUpdate = _b === void 0 ? false : _b, showLoading = props.showLoading, _c = props.loadingOption, loadingOption = _c === void 0 ? null : _c, style = props.style, _d = props.className, className = _d === void 0 ? '' : _d;
    var eleRef = (0, react_1.useRef)(null);
    var isInitialResizeRef = (0, react_1.useRef)(true);
    var _e = (0, react_1.useState)(null), echartsInstance = _e[0], setEchartsInstance = _e[1];
    var dispose = (0, react_1.useCallback)(function () {
        if (eleRef.current) {
            try {
                (0, size_sensor_1.clear)(eleRef.current);
            }
            catch (e) {
                console.warn(e);
            }
            // dispose echarts instance
            echarts.dispose(eleRef.current);
        }
    }, [echarts]);
    var resize = (0, react_1.useCallback)(function () {
        if (echartsInstance && !isInitialResizeRef.current) {
            try {
                echartsInstance.resize();
            }
            catch (e) {
                console.warn(e);
            }
        }
        isInitialResizeRef.current = false;
    }, [echartsInstance]);
    var updateEChartsOption = (0, react_1.useCallback)(function () {
        var echartInstance = echarts.getInstanceByDom(eleRef.current) || echarts.init(eleRef.current, theme, opts);
        echartInstance.setOption(option, notMerge, lazyUpdate);
        if (showLoading)
            echartInstance.showLoading(loadingOption);
        else
            echartInstance.hideLoading();
        return echartInstance;
    }, [echarts, theme, opts, option, notMerge, lazyUpdate, showLoading, loadingOption]);
    var renderNewEcharts = (0, react_1.useCallback)(function () {
        var echartInstance = updateEChartsOption();
        setEchartsInstance(echartInstance);
        if ((0, is_function_1.isFunction)(onChartReady))
            onChartReady(echartInstance);
        if (eleRef.current) {
            (0, size_sensor_1.bind)(eleRef.current, function () {
                resize();
            });
        }
        if (onEvents) {
            Object.entries(onEvents).forEach(function (_a) {
                var eventName = _a[0], func = _a[1];
                if ((0, is_string_1.isString)(eventName) && (0, is_function_1.isFunction)(func)) {
                    echartInstance.on(eventName, function (param) {
                        func(param, echartInstance);
                    });
                }
            });
        }
    }, [updateEChartsOption, onChartReady, resize, onEvents]);
    (0, react_1.useEffect)(function () {
        renderNewEcharts();
        return function () { return dispose(); };
    }, [renderNewEcharts, dispose]);
    (0, react_1.useEffect)(function () {
        var pickKeys = ['option', 'notMerge', 'lazyUpdate', 'showLoading', 'loadingOption'];
        var prevProps = { option: option, notMerge: notMerge, lazyUpdate: lazyUpdate, showLoading: showLoading, loadingOption: loadingOption, style: style, className: className };
        if ((0, is_function_1.isFunction)(shouldSetOption) && !shouldSetOption(prevProps, props)) {
            return;
        }
        if (!(0, is_equal_1.isEqual)((0, pick_1.pick)(props, pickKeys), (0, pick_1.pick)(prevProps, pickKeys))) {
            updateEChartsOption();
        }
        if (!(0, is_equal_1.isEqual)(prevProps.style, style) || !(0, is_equal_1.isEqual)(prevProps.className, className)) {
            resize();
        }
    }, [props, shouldSetOption, style, className, updateEChartsOption, resize]);
    var newStyle = tslib_1.__assign({ height: 300 }, style);
    return (react_1.default.createElement("div", { ref: function (e) {
            eleRef.current = e;
        }, style: newStyle, className: "echarts-for-react ".concat(className) }));
};
exports.default = EChartsReactCore;
//# sourceMappingURL=core.js.map