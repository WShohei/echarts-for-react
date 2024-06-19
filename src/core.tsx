'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { bind, clear } from 'size-sensor';
import { pick } from './helper/pick';
import { isFunction } from './helper/is-function';
import { isString } from './helper/is-string';
import { isEqual } from './helper/is-equal';
import { EChartsReactProps, EChartsInstance } from './types';

/**
 * core component for echarts binding
 */
const EChartsReactCore: React.FC<EChartsReactProps> = (props) => {
  const {
    echarts,
    shouldSetOption,
    theme,
    opts,
    onEvents,
    onChartReady,
    option,
    notMerge = false,
    lazyUpdate = false,
    showLoading,
    loadingOption = null,
    style,
    className = '',
  } = props;

  const eleRef = useRef<HTMLElement | null>(null);
  const isInitialResizeRef = useRef(true);
  const [echartsInstance, setEchartsInstance] = useState<EChartsInstance | null>(null);

  const dispose = useCallback(() => {
    if (eleRef.current) {
      try {
        clear(eleRef.current);
      } catch (e) {
        console.warn(e);
      }
      // dispose echarts instance
      echarts.dispose(eleRef.current);
    }
  }, [echarts]);

  const resize = useCallback(() => {
    if (echartsInstance && !isInitialResizeRef.current) {
      try {
        echartsInstance.resize();
      } catch (e) {
        console.warn(e);
      }
    }
    isInitialResizeRef.current = false;
  }, [echartsInstance]);

  const updateEChartsOption = useCallback((): EChartsInstance => {
    const echartInstance = echarts.getInstanceByDom(eleRef.current) || echarts.init(eleRef.current, theme, opts);
    echartInstance.setOption(option, notMerge, lazyUpdate);
    if (showLoading) echartInstance.showLoading(loadingOption);
    else echartInstance.hideLoading();
    return echartInstance;
  }, [echarts, theme, opts, option, notMerge, lazyUpdate, showLoading, loadingOption]);

  const renderNewEcharts = useCallback(() => {
    const echartInstance = updateEChartsOption();
    setEchartsInstance(echartInstance);

    if (isFunction(onChartReady)) onChartReady(echartInstance);

    if (eleRef.current) {
      bind(eleRef.current, () => {
        resize();
      });
    }

    if (onEvents) {
      Object.entries(onEvents).forEach(([eventName, func]) => {
        if (isString(eventName) && isFunction(func)) {
          echartInstance.on(eventName, (param) => {
            func(param, echartInstance);
          });
        }
      });
    }
  }, [updateEChartsOption, onChartReady, resize, onEvents]);

  useEffect(() => {
    renderNewEcharts();
    return () => dispose();
  }, [renderNewEcharts, dispose]);

  useEffect(() => {
    const pickKeys = ['option', 'notMerge', 'lazyUpdate', 'showLoading', 'loadingOption'];
    const prevProps = { option, notMerge, lazyUpdate, showLoading, loadingOption, style, className };

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

  const newStyle = { height: 300, ...style };

  return (
    <div
      ref={(e: HTMLElement) => {
        eleRef.current = e;
      }}
      style={newStyle}
      className={`echarts-for-react ${className}`}
    />
  );
};

export default EChartsReactCore;
