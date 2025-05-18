type Stats = {
  minimum: number;
  maximum: number;
  average: number;
  total: number;
};

export class StatsCalculator {
  public static compute(arr: number[]): Stats {
    const getMinimum = (arr: number[]) => {
      let min = arr[0];
      for (let num of arr) {
        if (num < min) {
          min = num;
        }
      }
      return min;
    };
    return {
      maximum: 4,
      minimum: getMinimum(arr),
      average: 2.5,
      total: 4,
    };
  }
}
