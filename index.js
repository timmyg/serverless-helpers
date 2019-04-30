const aws = require("aws-sdk");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
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
    return user.sub;
  } catch (e) {
    return null;
  }
};

exports.getPathParameters = function(event) {
  return event.pathParameters;
};

exports.invokeFunction = async function(functionName, body, pathParameters) {
  var lambda = new aws.Lambda();
  var opts = {
    FunctionName: functionName,
    InvocationType: "Event",
    Payload: JSON.stringify({
      pathParameters: {
        pathParameters
      },
      body: JSON.stringify({
        body
      })
    })
  };
  return lambda.invoke(opts).promise();
};

exports.invokeFunctionSync = function(functionName, body, pathParameters) {
  var lambda = new aws.Lambda();
  var opts = {
    FunctionName: functionName,
    InvocationType: "RequestResponse",
    Payload: JSON.stringify({
      pathParameters: {
        pathParameters
      },
      body: JSON.stringify({
        body
      })
    })
  };
  return lambda.invoke(opts).promise();
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
