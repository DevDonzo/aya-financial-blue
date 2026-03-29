# `AutomationActionHttpOptionInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `url` | `String!` | `` |  |
| `method` | `HttpMethod!` | `` |  |
| `headers` | `[HttpHeaderInput]` | `` |  |
| `parameters` | `[HttpParameterInput]` | `` |  |
| `contentType` | `HttpContentType` | `` |  |
| `body` | `String` | `` |  |
| `authorizationType` | `HttpAuthorizationType` | `` |  |
| `authorizationBasicAuth` | `HttpAuthorizationBasicAuthInput` | `` |  |
| `authorizationBearerToken` | `String` | `` |  |
| `authorizationApiKey` | `HttpAuthorizationApiKeyInput` | `` |  |
| `oauthConnectionId` | `String` | `` |  |
