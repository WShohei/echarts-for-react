import React from 'react';
import * as echarts from 'echarts';
import { EChartsReactProps, EChartsOption, EChartsInstance } from './types';
import EChartsReactCore from './core';

export { EChartsReactProps, EChartsOption, EChartsInstance };

// Functional component to export the EChartsReact with echarts object initialization
const EChartsReact: React.FC<EChartsReactProps> = (props) => {
  return <EChartsReactCore {...props} echarts={echarts} />;
};

export default EChartsReact;
