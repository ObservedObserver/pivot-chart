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
}