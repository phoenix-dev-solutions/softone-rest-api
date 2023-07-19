# Softone API - Node.js Client

A Node.js client for the Softone REST API. Easily interact with the Softone REST API using this library.

## Installation

```
npm install softone-rest-api
```

```
yarn add softone-rest-api
```

## Getting started

GET API credentials from your Softone dealer
.

Soft1 Web Services reference <https://softone.gr/ws/>.

## Setup

Setup for the REST API integration :

```js
var SoftoneRestApi = require('softone-rest-api');

const softone = new SoftoneRestApi({
  url: 'xxxx',
  username: 'xxxx',
  password: 'xxxx',
  appId: 'xxxx',
});
```

### Options

| Option           | Type      | Required | Description                                                                                                                      |
| ---------------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `url`            | `String`  | yes      | Softone oncloud.gr url                                                                                                           |
| `devUrl`         | `String`  | no       | Sandbox Softone oncloud.gr url. If empty add dev- to main url e.x. `https://dev-demo.oncloud.gr`                                 |
| `username`       | `String`  | yes      | Your username                                                                                                                    |
| `password`       | `String`  | yes      | Your password                                                                                                                    |
| `appId`          | `Integer` | yes      | Your application id                                                                                                              |
| `company`        | `Integer` | no       | Login company. Used in loginAuthenticate and setAutoLogin                                                                        |
| `branch`         | `Integer` | no       | Login branch. Used in loginAuthenticate and setAutoLogin                                                                         |
| `module`         | `Integer` | no       | Login module. Used in loginAuthenticate and setAutoLogin                                                                         |
| `refId`          | `Integer` | no       | Login refid. Used in loginAuthenticate and setAutoLogin                                                                          |
| `logindate`      | `String`  | no       | Login date for service login                                                                                                     |
| `timezoneoffset` | `String`  | no       | Login timezoneoffset for service login                                                                                           |
| `sandbox`        | `Boolean` | no       | Define if is sandox or not.Default is `false`                                                                                    |
| `autoLogin`      | `Boolean` | no       | Auto login to Softone and store clientId for next requests                                                                       |
| `loginObjs`      | `Integer` | no       | Array index of objs from login response. Used for auto login if not define company, branche, module and refId. Default index `0` |
| `encoding`       | `String`  | no       | Encoding, default is `utf-8`                                                                                                     |
| `timeout`        | `Integer` | no       | Define the request timeout                                                                                                       |
| `axiosConfig`    | `Object`  | no       | Define the custom [Axios config](https://github.com/axios/axios#request-config), also override this library options              |

## Methods

### GET

- `.get( data)`
- `.get( data, params)`

| Params   | Type     | Description                                                 |
| -------- | -------- | ----------------------------------------------------------- |
| `data`   | `Object` | JS object to be converted into JSON and sent in the request |
| `params` | `Object` | Query strings params                                        |

### POST

- `.post( data)`
- `.post( data, params)`

| Params   | Type     | Description                                                 |
| -------- | -------- | ----------------------------------------------------------- |
| `data`   | `Object` | JS object to be converted into JSON and sent in the request |
| `params` | `Object` | Query strings params                                        |

### LOGIN

- `.login( data)`
- `.login( data, params)`

| Params   | Type     | Description                                                 |
| -------- | -------- | ----------------------------------------------------------- |
| `data`   | `Object` | JS object to be converted into JSON and sent in the request |
| `params` | `Object` | Query strings params                                        |

### AUTHENTICATE

- `.authenticate( data)`
- `.authenticate( data, params)`

| Params   | Type     | Description                                                 |
| -------- | -------- | ----------------------------------------------------------- |
| `data`   | `Object` | JS object to be converted into JSON and sent in the request |
| `params` | `Object` | Query strings params                                        |

### LOGINAUTHENTICATE

- `.loginAuthenticate( data)`
- `.loginAuthenticate( data, params)`

| Params   | Type     | Description                                                 |
| -------- | -------- | ----------------------------------------------------------- |
| `data`   | `Object` | JS object to be converted into JSON and sent in the request |
| `params` | `Object` | Query strings params                                        |

### SETAUTOLOGIN

- `.setAutoLogin()`
- `.setAutoLogin( params)`

| Params   | Type     | Description          |
| -------- | -------- | -------------------- |
| `params` | `Object` | Query strings params |

## Example of use can see in test and test with

```js
yarn test
```

or

```js
npm test
```

## Release History

- 2023-07-19 - v1.0.0 - Initial release.
