# GraphQL REST Connections
[![Build Status](https://secure.travis-ci.org/dowjones/graphql-rest-connections.png)](http://travis-ci.org/dowjones/graphql-rest-connections) [![NPM version](https://badge.fury.io/js/graphql-rest-connections.svg)](http://badge.fury.io/js/graphql-rest-connections)

This library helps with pagination in GraphQL, when backed by REST services.

It will convert a Connection object, as defined by the
[Cursor Connection Specification](https://facebook.github.io/relay/graphql/connections.htm):

```json
{
  "edges": [{
    "cursor": "d02dsf",
    "node": {"id": "56", "name": "mary"}
  }, {
    "cursor": "b8df4=",
    "node": {"id": "78", "name": "joe"}
  }],
  "pageInfo": {
    "startCursor": "d02dsf",
    "endCursor": "b8df4=",
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

and turn it into a list of headers and nodes, so that
it could easily be returned by a RESTful service:

```
GET /users
Content-Type: application/json
x-pageinfo-start-cursor: d02dsf
x-pageinfo-end-cursor: b8df4=
x-pageinfo-has-previous-page: true
x-pageinfo-has-next-page: false
x-pageinfo-cursors: d02dsf,b8df4=

[
  {"id": "56", "name": "mary"},
  {"id": "78", "name": "joe"}
]
```

Note that the returned objects is a list of resources that are
exactly the same as ones you would get from `/users/78` (for example).
The pagination info goes inside the `pageinfo` headers.


## Usage

  - `isConnection(object)` -- determines whether the object is a Connection
  - `fromConnection(connection)` -- returns `{nodes: [], headers: []}`
  - `toConnection(nodes, headers)` -- returns a `connection`


In a REST service:

```js
app.get('/users', (req, res, next) => {
  service.getUserConnections(req.query)
    .catch(next)
    .then(connection => {
      const {nodes, headers} = fromConnection(connection);
      res.set(headers);
      res.json(nodes);
    });
});
```

In GraphQL service that is backed by the REST service above:

```js
const userConnections = {
  type: userConnection,
  args: connectionArgs,
  resolve: ((_, args) => {
    requestPromise.get({
      uri: USER_SERVICE_URI,
      qs: args,
      json: true,
      resolveWithFullResponse: true
    })
    .then(res => toConnection(res.body, res.headers));
  })
};
```

## Related

[GraphQL DynamoDB Connections](https://github.com/dowjones/graphql-dynamodb-connections)


## License

[MIT](/LICENSE)
