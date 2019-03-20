# serverless-helpers

```js
// http response

respond((statusCode = 200), (body = {}));
```

```js
// get body from lambda event

getBody(event);
```

```js
// get path params from lambda event

getPathParameters(event);
```

```js
// invoke another lambda function from a function

invokeFunction(functionName, body, pathParameters);
```
