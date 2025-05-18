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

    const getMaximum = (arr: number[]) => {
      let max = arr[0];
      for (let num of arr) {
        if (num > max) {
          max = num;
        }
      }
      return max;
    };

    const total = arr.length;

    const getSum = (arr: number[]) => {
      let sum = 0;
      for (let num of arr) {
        sum += num;
      }
      return sum;
    };

    const average = getSum(arr) / total;

    return {
      maximum: getMaximum(arr),
      minimum: getMinimum(arr),
      average: average,
      total,
    };
  }
}
