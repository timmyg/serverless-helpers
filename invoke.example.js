(async () => {
  const { Invoke } = require("./index");
  //   class Invoke {
  //     constructor() {
  //       this._region = "us-east";
  //       this._stage = process.env.stage;
  //       this._service = undefined;
  //       this._func = undefined;
  //       this._body = {};
  //       this._pathParams = undefined;
  //       this._headers = undefined;
  //       this._queryParams = undefined;
  //     }

  //     service(service) {
  //       this._service = service;
  //       return this;
  //     }

  //     func(func) {
  //       this._func = func;
  //       return this;
  //     }

  //     pathParams(pathParams) {
  //       this._pathParams = pathParams;
  //       return this;
  //     }

  //     headers(headers) {
  //       this._headers = headers;
  //       return this;
  //     }

  //     queryParams(queryParams) {
  //       this._queryParams = queryParams;
  //       return this;
  //     }

  //     body(body) {
  //       this._body = body;
  //       return this;
  //     }

  //     region(region) {
  //       this._region = region;
  //       return this;
  //     }

  //     stage(stage) {
  //       this._stage = stage;
  //       return this;
  //     }

  //     async go() {
  //       //     console.log(this);
  //       //     const lambda = new aws.Lambda({ region: this._region });
  //       //     const options = {
  //       //       FunctionName: `${this._service}-${this._stage}-${this._name}`,
  //       //       InvocationType: "RequestResponse",
  //       //       Payload: JSON.stringify({
  //       //         headers: this._headers,
  //       //         pathParameters: this._pathParams,
  //       //         queryStringParameters: this._queryParams,
  //       //         body: JSON.stringify(this._body)
  //       //       })
  //       //     };
  //       //     const result = await lambda.invoke(options).promise();
  //       //     return {
  //       //       data: JSON.parse(JSON.parse(result.Payload).body),
  //       //       statusCode: JSON.parse(result.Payload).statusCode
  //       //     };
  //       console.log("2");
  //       return await new Promise(resolve => setTimeout(resolve, 3000));
  //     }
  //   }

  console.log("1");
  let x = new Invoke();
  console.log("2");
  console.log(x);
  console.log(x.region);
  await x.region("west").go();
  console.log("4");
})();
