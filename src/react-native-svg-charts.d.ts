declare module 'react-native-svg-charts' {
    import { Component } from 'react';
    import { Animated } from 'react-native';
  
    export interface PieChartDataItem {
      key: string | number;
      value: number;
      svg?: object;
    }
  
    export interface PieChartProps {
      style?: object;
      data?: PieChartDataItem[];
      valueAccessor?: (props: { item: PieChartDataItem }) => number;
      spacing?: number;
      outerRadius?: string | number;
      innerRadius?: string | number;
      labelRadius?: string | number;
      startAngle?: number;
      endAngle?: number;
      sort?: (a: PieChartDataItem, b: PieChartDataItem) => number;
      animate?: boolean;
      animationDuration?: number;
      animateWithSpring?: boolean;
      animateWithTiming?: boolean;
      animateTransform?: string;
      scale?: Animated.Value | object;
      clamp?: boolean;
      clampDisabled?: boolean;
      numberOfTicks?: number;
      extras?: number[];
      renderDecorator?: (props: { x: number; y: number; index: number; item: PieChartDataItem }) => React.ReactNode;
      renderLabel?: (props: { x: number; y: number; item: PieChartDataItem }) => React.ReactNode;
      renderLegend?: (props: { legend: PieChartDataItem }) => React.ReactNode;
      renderTitle?: (props: { x: number; y: number }) => React.ReactNode;
      renderValue?: (props: { x: number; y: number }) => React.ReactNode;
      renderNote?: (props: { x: number; y: number }) => React.ReactNode;
    }
  
    export class PieChart extends Component<PieChartProps> {}
  
    // Add other exported components and types from 'react-native-svg-charts' as needed
  }
  