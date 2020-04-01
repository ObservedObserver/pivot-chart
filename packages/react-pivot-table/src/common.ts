import { AggFC } from 'cube-core/built/types';

export interface Record {
  [key: string]: any
}

export type DataSource = Record[];

export interface NestTree {
  id: string;
  children?: NestTree[];
  expanded?: boolean;
  path?: number[];
}

export interface Field {
  /**
   * id: key in data record
   */
  id: string;
  /**
   * display name for field
   */
  name: string;
  /**
   * aggregator's name
   */
  aggName?: string;
  [key: string]: any;
  cmp?: (a: any, b: any) => number;
}

export interface Measure extends Field {
  aggregator?: AggFC;
  minWidth?: number;
  formatter?: (value: number | undefined) => number | string;
}

export type VisType = 'number' | 'bar' | 'line' | 'scatter';
export {
  AggFC
}

export interface Filter extends Field {
  values: any[];
  domain: any[];
}

export enum DimensionArea {
  row = 'row',
  column = 'column'
}

export type AggNodeConfig = {
  [key in DimensionArea]: boolean
}

export interface PivotBaseProps {
  rows: Field[];
  columns: Field[];
  measures: Measure[];
  visType?: VisType;
  defaultExpandedDepth?: {
    rowDepth: number;
    columnDepth: number;
  };
  showAggregatedNode?: {
    [key in DimensionArea]: boolean;
  }
}