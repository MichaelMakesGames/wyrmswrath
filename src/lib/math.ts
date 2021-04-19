import mexp from "math-expression-evaluator";

export function rangeFromTo(from: number, to: number): number[] {
  const results: number[] = [];
  for (let i = from; i < to; i++) {
    results.push(i);
  }
  return results;
}

export function rangeTo(to: number): number[] {
  return rangeFromTo(0, to);
}

export function calcPercentile(
  sortedArray: number[],
  percentile: number,
): number {
  const index = Math.min(
    sortedArray.length,
    Math.max(0, Math.round((sortedArray.length * percentile) / 100)),
  );
  return sortedArray[index];
}

export function sum(...numbers: number[]) {
  return numbers.reduce((acc, cur) => acc + cur, 0);
}

export function round(value: number, precision: number = 0) {
  return Math.round(value * 10 ** precision) / 10 ** precision;
}

const MEXP_TOKENS = [
  {
    type: 0,
    token: "roundup",
    show: "roundup",
    value: (a: number) => Math.ceil(a),
  },
];

export function evalMath(
  expression: string,
  variables: Record<string, number> = {},
) {
  return mexp.eval(
    expression,
    [
      ...MEXP_TOKENS,
      ...Object.keys(variables).map((variable) => ({
        type: 3,
        token: variable,
        show: variable,
        value: variable,
      })),
    ],
    variables,
  );
}
