class Invoke {
  constructor() {
    this.region = "us-east";
    this.stage = process.env.stage;
    this.name = undefined;
    this.body = {};
    this.pathParams = undefined;
    this.headers = undefined;
    this.queryParams = undefined;
  }

  //   get create() {
  //     return this;
  //   }

  setName(name) {
    this.name = name;
    return this;
  }

  pathParams(pathParams) {
    this.pathParams = pathParams;
    return this;
  }

  headers(headers) {
    this.headers = headers;
    return this;
  }

  queryParams(queryParams) {
    this.queryParams = queryParams;
    return this;
  }

  body(body) {
    this.body = body;
    return this;
  }

  region(region) {
    this.region = region;
    return this;
  }

  create() {
    console.log(this);
  }

  //   async go() {
  //     console.log("go", this);
  //   }
}

let a = new Invoke();
console.log(a);
a.setName("functionName3") // => { value: 10 }
  .region("eu-west-1") // => { value: 7 }
  .create();
console.log(b);
