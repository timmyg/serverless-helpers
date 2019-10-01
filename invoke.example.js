(async () => {
  class Invoke {
    constructor() {
      this._region = "us-east";
      this._stage = process.env.stage;
      this._name = undefined;
      this._body = {};
      this._pathParams = undefined;
      this._headers = undefined;
      this._queryParams = undefined;
    }

    name(name) {
      this._name = name;
      return this;
    }

    pathParams(pathParams) {
      this._pathParams = pathParams;
      return this;
    }

    headers(headers) {
      this._headers = headers;
      return this;
    }

    queryParams(queryParams) {
      this._queryParams = queryParams;
      return this;
    }

    body(body) {
      this._body = body;
      return this;
    }

    region(region) {
      this._region = region;
      return this;
    }

    async go() {
      return new Promise(resolve => {
        setTimeout(resolve, 3000);
      });
    }
  }

  let a = new Invoke();
  console.log(a);
  console.log("1");
  a.name("functionName3").region("eu-west-1");
  await a.go();
  console.log("2!");
})();
