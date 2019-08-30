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

exports.invokeFunctionSync = function(
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
  console.log("1");
  return lambda
    .invoke(opts)
    .promise()
    .map(function(result) {
      console.log("2");
      console.log(result);
      console.log(JSON.parse(JSON.parse(result.Payload).body));
      return JSON.parse(JSON.parse(result.Payload).body);
    });
};

const analytics = new (require("analytics-node"))(
  process.env.segmentWriteKey || process.env.SEGMENT_WRITE_KEY
);
const [identify, track] = [
  analytics.identify.bind(analytics),
  analytics.track.bind(analytics)
].map(promisify);

exports.identify = identify;
exports.track = track;
