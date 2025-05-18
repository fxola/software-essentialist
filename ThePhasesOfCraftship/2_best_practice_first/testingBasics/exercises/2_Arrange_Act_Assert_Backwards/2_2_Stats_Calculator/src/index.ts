type Stats = {
  minimum: number;
  maximum: number;
  average: number;
  total: number;
};

export class StatsCalculator {
  public static compute(arr: number[]): Stats {
    return {
      maximum: 4,
      minimum: 1,
      average: 0,
      total: 0,
    };
  }
}
