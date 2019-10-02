const aws = require("aws-sdk");
const jwt = require("jsonwebtoken");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,partner",
  "Content-Type": "application/json"
};

exports.respond = function(statusCode = 200, body = {}) {
  let msg = body;
  if (typeof msg === "string") {
    msg = { message: msg };
  }

  return {
    statusCode,
    headers,
    body: JSON.stringify(msg)
  };
};

exports.getBody = function(event) {
  try {
    return JSON.parse(event.body);
  } catch (e) {
    return event.body;
  }
};

exports.getAuthBearerToken = function(event) {
  try {
    return event.headers.Authorization.split(" ")[1];
  } catch (e) {
    return null;
  }
};

exports.getUserId = function(event) {
  try {
    const token = event.headers.Authorization.split(" ")[1];
    const user = jwt.decode(token);
    return user.sub.replace("sms|", "");
  } catch (e) {
    return null;
  }
};

exports.getPathParameters = function(event) {
  return event.pathParameters;
};

class Invoke {
  constructor() {
    this._region = "us-east";
    this._stage = process.env.stage;
    this._service = undefined;
    this._name = undefined;
    this._body = {};
    this._pathParams = undefined;
    this._headers = undefined;
    this._queryParams = undefined;
    this._sync = true;
  }

  service(service) {
    this._service = service;
    return this;
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

  stage(stage) {
    this._stage = stage;
    return this;
  }

  async() {
    this._sync = false;
    return this;
  }

  sync() {
    this._sync = true;
    return this;
  }

  async go() {
    // return await new Promise(resolve => setTimeout(resolve, 3000));
    const lambda = new aws.Lambda({ region: this._region });
    const options = {
      FunctionName: `${this._service}-${this._stage}-${this._name}`,
      InvocationType: this._sync ? "RequestResponse" : "Event",
      Payload: JSON.stringify({
        headers: this._headers,
        pathParameters: this._pathParams,
        queryStringParameters: this._queryParams,
        body: JSON.stringify(this._body)
      })
    };
    const result = await lambda.invoke(options).promise();
    return {
      data: JSON.parse(JSON.parse(result.Payload).body),
      statusCode: JSON.parse(result.Payload).statusCode
    };
  }
}

exports.Invoke = Invoke;
