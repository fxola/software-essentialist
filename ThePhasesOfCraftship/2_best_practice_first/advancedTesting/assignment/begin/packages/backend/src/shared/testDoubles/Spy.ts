type ValidMethodNames<T> = keyof T; // example of T is UserRepository

interface Call<T> {
  methodName: ValidMethodNames<T>;
  args: any[];
  context: any;
}

export class Spy<T> {
  protected calls: Call<T>[];
  constructor() {
    this.calls = [];
  }

  addCall<MethodName extends ValidMethodNames<T>>(
    methodName: MethodName,
    args: any[],
    context?: any,
  ) {
    const call: Call<T> = {
      methodName,
      args,
      context,
    };

    this.calls.push(call);
  }

  getCalls() {
    return this.calls;
  }

  getNumberOfTimesCalled<MethodName extends ValidMethodNames<T>>(
    methodName: MethodName,
  ) {
    const calls = this.calls.filter((c) => c.methodName === methodName);
    return calls.length;
  }

  resetCalls() {
    this.calls = [];
  }
}
