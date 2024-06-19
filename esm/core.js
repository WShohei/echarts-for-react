import { __assign } from "tslib";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { bind, clear } from 'size-sensor';
import { pick } from './helper/pick';
import { isFunction } from './helper/is-function';
import { isString } from './helper/is-string';
import { isEqual } from './helper/is-equal';
/**
 * core component for echarts binding
 */
var EChartsReactCore = function (props) {
    'use client';
    var echarts = props.echarts, shouldSetOption = props.shouldSetOption, theme = props.theme, opts = props.opts, onEvents = props.onEvents, onChartReady = props.onChartReady, option = props.option, _a = props.notMerge, notMerge = _a === void 0 ? false : _a, _b = props.lazyUpdate, lazyUpdate = _b === void 0 ? false : _b, showLoading = props.showLoading, _c = props.loadingOption, loadingOption = _c === void 0 ? null : _c, style = props.style, _d = props.className, className = _d === void 0 ? '' : _d;
    var eleRef = useRef(null);
    var isInitialResizeRef = useRef(true);
    var _e = useState(null), echartsInstance = _e[0], setEchartsInstance = _e[1];
    var dispose = useCallback(function () {
        if (eleRef.current) {
            try {
                clear(eleRef.current);
            }
            catch (e) {
                console.warn(e);
            }
            // dispose echarts instance
            echarts.dispose(eleRef.current);
        }
    }, [echarts]);
    var resize = useCallback(function () {
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
    var updateEChartsOption = useCallback(function () {
        var echartInstance = echarts.getInstanceByDom(eleRef.current) || echarts.init(eleRef.current, theme, opts);
        echartInstance.setOption(option, notMerge, lazyUpdate);
        if (showLoading)
            echartInstance.showLoading(loadingOption);
        else
            echartInstance.hideLoading();
        return echartInstance;
    }, [echarts, theme, opts, option, notMerge, lazyUpdate, showLoading, loadingOption]);
    var renderNewEcharts = useCallback(function () {
        var echartInstance = updateEChartsOption();
        setEchartsInstance(echartInstance);
        if (isFunction(onChartReady))
            onChartReady(echartInstance);
        if (eleRef.current) {
            bind(eleRef.current, function () {
                resize();
            });
        }
        if (onEvents) {
            Object.entries(onEvents).forEach(function (_a) {
                var eventName = _a[0], func = _a[1];
                if (isString(eventName) && isFunction(func)) {
                    echartInstance.on(eventName, function (param) {
                        func(param, echartInstance);
                    });
                }
            });
        }
    }, [updateEChartsOption, onChartReady, resize, onEvents]);
    useEffect(function () {
        renderNewEcharts();
        return function () { return dispose(); };
    }, [renderNewEcharts, dispose]);
    useEffect(function () {
        var pickKeys = ['option', 'notMerge', 'lazyUpdate', 'showLoading', 'loadingOption'];
        var prevProps = { option: option, notMerge: notMerge, lazyUpdate: lazyUpdate, showLoading: showLoading, loadingOption: loadingOption, style: style, className: className };
        if (isFunction(shouldSetOption) && !shouldSetOption(prevProps, props)) {
            return;
        }
        if (!isEqual(pick(props, pickKeys), pick(prevProps, pickKeys))) {
            updateEChartsOption();
        }
        if (!isEqual(prevProps.style, style) || !isEqual(prevProps.className, className)) {
            resize();
        }
    }, [props, shouldSetOption, style, className, updateEChartsOption, resize]);
    var newStyle = __assign({ height: 300 }, style);
    return (React.createElement("div", { ref: function (e) {
            eleRef.current = e;
        }, style: newStyle, className: "echarts-for-react ".concat(className) }));
};
export default EChartsReactCore;
//# sourceMappingURL=core.js.map