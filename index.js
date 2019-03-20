const aws = require("aws-sdk");

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
  return JSON.parse(event.body);
};

exports.getPathParameters = function(event) {
  return event.pathParameters;
};

exports.callFunction = function(functionName, body, pathParameters) {
  var lambda = new aws.Lambda();
  var opts = {
    FunctionName: functionName,
    InvocationType: "Event", // async, RequestResponse is sync
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
