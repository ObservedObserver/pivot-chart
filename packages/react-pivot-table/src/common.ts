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
  /**
   * choosen values
   */
  values: any[];
  /**
   * all avaiable values
   */
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
  /**
   * dimensions in row
   */
  rows: Field[];
  /**
   * dimensions in columns
   */
  columns: Field[];
  /**
   * measures(or indicators) are values to be aggregated, apply statistic functions.
   */
  measures: Measure[];
  /**
   * visualization type display in table cell.
   */
  visType?: VisType;
  /**
   * default expanded level for dimension nest tree in row or column.
   */
  defaultExpandedDepth?: {
    rowDepth: number;
    columnDepth: number;
  };
  /**
   * whether show aggregated node for each level.
   */
  showAggregatedNode?: {
    [key in DimensionArea]: boolean;
  }
}