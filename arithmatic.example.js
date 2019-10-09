(async () => {
  class Invoke {
    constructor() {
      // this.value = 0;
      this.region = "us-east-1";
      this._name = "";
    }
    get val() {
      return this.value;
    }
    name(name) {
      this._name = name;
      return this;
    }
    add(value) {
      this.value += value;
      return this;
    }
    subtract(value) {
      this.value -= value;
      return this;
    }
    average(...args) {
      this.value = args.length
        ? this.sum(...args).value / args.length
        : undefined;
      return this;
    }
  }

  a = new Invoke();
  console.log(
    a
      .name(1) // => { value: 10 }
      .subtract(3) // => { value: 7 }
      .add(4).val // => { value: 11 } // => 11
  );
})();
