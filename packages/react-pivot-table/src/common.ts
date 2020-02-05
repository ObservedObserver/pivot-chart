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
  id: string;
  name: string;
  aggName?: string;
  [key: string]: any;
}

export interface Measure extends Field {
  aggregator?: AggFC
}

export type VisType = 'number' | 'bar' | 'line' | 'scatter';