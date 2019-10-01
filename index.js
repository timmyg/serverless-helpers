const aws = require("aws-sdk");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

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

exports.invokeFunctionSync = async function(
  functionName,
  body,
  pathParameters,
  headers,
  queryParams,
  region
) {
  var lambda = new aws.Lambda({ region });
  var opts = {
    FunctionName: functionName,
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({
      headers,
      pathParameters,
      queryStringParameters: queryParams,
      body: JSON.stringify(body)
    })
  };
  const result = await lambda.invoke(opts).promise();
  return {
    data: JSON.parse(JSON.parse(result.Payload).body),
    statusCode: JSON.parse(result.Payload).statusCode
  };
};

exports.invokeFunctionAsync = async function(
  functionName,
  body,
  pathParameters,
  headers,
  queryParams,
  region
) {
  var lambda = new aws.Lambda({ region });
  var opts = {
    FunctionName: functionName,
    InvocationType: "Event",
    Payload: JSON.stringify({
      headers,
      pathParameters,
      queryStringParameters: queryParams,
      body: JSON.stringify(body)
    })
  };
  const result = await lambda.invoke(opts).promise();
  if (result && result.Payload) {
    return {
      data: JSON.parse(JSON.parse(result.Payload).body),
      statusCode: JSON.parse(result.Payload).statusCode
    };
  } else {
    return;
  }
};

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

  name(name) {
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

  async function go() {
    const lambda = new aws.Lambda({ this.region });
    const options = {
      FunctionName: this.name,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        this.headers,
        pathParameters: this.pathParams,
        queryStringParameters: this.queryParams,
        body: JSON.stringify(this.body)
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

// exports.invoke = async function() {

//   a = new Invoke();
// };

// const analytics = new (require("analytics-node"))(
//   process.env.segmentWriteKey || process.env.SEGMENT_WRITE_KEY
// );
// const [identify, track] = [
//   analytics.identify.bind(analytics),
//   analytics.track.bind(analytics)
// ].map(promisify);

// exports.identify = identify;
// exports.track = track;
