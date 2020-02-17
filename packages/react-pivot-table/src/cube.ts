import { Record, DataSource, NestTree } from "./common";
import { QueryPath } from './utils';
import { getTheme } from './theme';
const theme = getTheme();

type CuboidNode = Map<string, CuboidNode | Record>;

export class Cuboid {
  public readonly dimensions: string[];
  // public readonly measures: string[];
  private tree: CuboidNode;
  constructor (props: { dimensions: string[]; dataSource: DataSource }) {
    const { dimensions, dataSource } = props;
    this.dimensions = dimensions;
    this.tree = new Map();
    this.buildCuboid(dataSource);
  }
  private insertNode (node: CuboidNode, record: Record, depth: number) {
    let dim = this.dimensions[depth];
    let dimValue = record[dim] || '';
    if (depth >= this.dimensions.length - 1) {
      node.set(dimValue, record);
      return;
    }
    if (!node.has(dimValue)) {
      node.set(dimValue, new Map());
    }
    this.insertNode(node.get(dimValue) as CuboidNode, record, depth + 1);
  }
  private transCuboidDFS (hashNode: CuboidNode, node: NestTree, depth: number) {
    if (depth === this.dimensions.length) {
      return;
    }
    node.children = []
    for (let child of hashNode) {
      let childInNode: NestTree = { id: child[0] };
      this.transCuboidDFS(child[1] as CuboidNode, childInNode, depth + 1)
      node.children.push(childInNode);
    }
  }
  public getNestTree () {
    let nestTree: NestTree = { id: theme.root.label };
    this.transCuboidDFS(this.tree, nestTree, 0);
    return nestTree;
  }
  public buildCuboid (dataSource: DataSource) {
    let len = dataSource.length;
    for (let i = 0; i < len; i++) {
      this.insertNode(this.tree, dataSource[i], 0);
    }
  }
  public get (path: QueryPath) {
    let adjustPath: string[] = [];
    for (let dim of this.dimensions) {
      let value = path.find(p => p.dimCode === dim);
      adjustPath.push(typeof value !== 'undefined' ? value.dimValue : '*');
    }
    return this.query(this.tree, adjustPath, 0);
  }
  private query (node: CuboidNode, path: string[], depth: number): Record[] {
    if (depth >= this.dimensions.length - 1) {
      let value = path[depth] || '';
      if (value === '*') return [...node.values()];
      return node.has(value) ? [node.get(value)] : [];
    }
    let children: Record[] = [];
    for (let child of node) {
      let childRecords = this.query(child[1] as CuboidNode, path, depth + 1);
      for (let record of childRecords) {
        children.push(record);
      }
    }
    return children;
  }
}
// todo query path support array
export class DynamicCube {
  private computeCuboid: (path: QueryPath) => Promise<DataSource>;
  private cuboids: Map<string, Cuboid>;
  constructor (props: { computeCuboid: (path: QueryPath) => Promise<DataSource> }) {
    this.computeCuboid = props.computeCuboid;
    this.cuboids = new Map();
  }
  public async getCuboid (dimSet: string[]): Promise<Cuboid> {
    const key = dimSet.join(';');
    if (this.cuboids.has(key)) {
      return this.cuboids.get(key);
    }
    const path: QueryPath = dimSet.map(d => {
      return {
        dimCode: d,
        dimValue: '*'
      }
    });
    const cuboidDataSource = await this.computeCuboid(path);
    const cuboid = new Cuboid({
      dimensions: dimSet,
      dataSource: cuboidDataSource
    });
    this.cuboids.set(key, cuboid);
    return cuboid;
  }
}