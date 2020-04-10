import { DataSource, Field } from "../../common";
interface DiscreteScale {
  id: string;
  type: 'discrete';
  domain: any[];
}
interface ContinuousScale {
  id: string;
  type: 'continuous';
  domain: [number, number];
}
export type Scale = DiscreteScale | ContinuousScale;

export interface VisualScaleSpace {
  dimensions: Scale[];
  measures: Scale[];
}
export function getVisualScale (facetMatrix: DataSource[][], dimensions: Field[], measures: Field[]): VisualScaleSpace {
  let ans: VisualScaleSpace = {
    dimensions: dimensions.map(dim => ({
      id: dim.id,
      type: 'discrete',
      domain: []
    })),
    measures: measures.map(mea => ({
      id: mea.id,
      type: 'continuous',
      domain: [0, 0]
    }))
  }
  let cardinalityOfDimensions: Array<Set<any> > = dimensions.map(() => new Set());
  for (let i = 0; i < facetMatrix.length; i++) {
    for (let j = 0; j < facetMatrix[i].length; j++) {
      let dataSource = facetMatrix[i][j];
      for (let record of dataSource) {
        dimensions.forEach((dim, dIndex) => {
          cardinalityOfDimensions[dIndex].add(record[dim.id]);
        });
        measures.forEach((mea, mIndex) => {
          ans.measures[mIndex].domain[0] = Math.min(
            record[mea.id],
            ans.measures[mIndex].domain[0]
          );
          ans.measures[mIndex].domain[1] = Math.max(
            record[mea.id],
            ans.measures[mIndex].domain[1]
          );
        })
      }
    }
  }
  dimensions.forEach((dim, dIndex) => {
    ans.dimensions[dIndex].domain = [...cardinalityOfDimensions[dIndex]];
  })
  return ans;
}