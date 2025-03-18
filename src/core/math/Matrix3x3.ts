export class Matrix3x3 {
  private values: number[][];

  constructor(values: number[][]) {
    if (values.length !== 3 || values.some((row) => row.length !== 3)) {
      throw new Error('Matrix must be 3x3.');
    }
    this.values = values;
  }

  public getValues(): number[][] {
    return this.values;
  }

  public static identity(): Matrix3x3 {
    return new Matrix3x3([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
  }

  public static translation(tx: number, ty: number): Matrix3x3 {
    return new Matrix3x3([
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1],
    ]);
  }

  public static rotation(angle: number): Matrix3x3 {
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    return new Matrix3x3([
      [cosA, -sinA, 0],
      [sinA, cosA, 0],
      [0, 0, 1],
    ]);
  }

  public static scale(sx: number, sy: number): Matrix3x3 {
    return new Matrix3x3([
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1],
    ]);
  }

  public multiply(other: Matrix3x3): Matrix3x3 {
    const result = Array(3)
      .fill(0)
      .map(() => Array(3).fill(0));

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result[i][j] =
          this.values[i][0] * other.values[0][j] +
          this.values[i][1] * other.values[1][j] +
          this.values[i][2] * other.values[2][j];
      }
    }

    return new Matrix3x3(result);
  }
}
