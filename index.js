'use strict';

// Libraries
const axios = require('axios');
const iconv = require('iconv-lite');
const { URL } = require('url');

// Settings
const pjson = require('./package.json');
const SoftOneContentType = 'application/json; charset=windows-1253';

/**
 * Softone REST API wrapper
 *
 * @param {Object} opt
 */
class SoftoneRestApi {
  /**
   * Class constructor.
   *
   * @param {Object} opt
   */
  constructor(opt) {
    if (!(this instanceof SoftoneRestApi)) {
      return new SoftoneRestApi(opt);
    }

    opt = opt || {};

    if (!opt.url) {
      throw new OptionsException('Url required');
    } else {
      const parsedUrl = new URL(opt.url);
      if (parsedUrl.protocol != 'https:')
        throw new OptionsException('URL protocol must be https');

      opt.url = parsedUrl.origin + '/s1services';
    }

    if (opt.devUrl) {
      const parsedUrl = new URL(opt.devUrl);
      if (parsedUrl.protocol != 'https:')
        throw new OptionsException('URL protocol must be https');

      opt.devUrl = parsedUrl.origin + '/s1services';
    } else {
      const parsedUrl = new URL(opt.url);

      opt.devUrl =
        parsedUrl.protocol + '//dev-' + parsedUrl.host + '/s1services';
    }

    if (!opt.username) {
      throw new OptionsException('Username is required');
    }

    if (!opt.password) {
      throw new OptionsException('Password is required');
    }

    if (!opt.appId) {
      throw new OptionsException('AppId is required');
    }

    this.classVersion = pjson.version;

    this._setDefaultsOptions(opt);

    if (opt.autoLogin) {
      this.setAutoLogin();
    }
  }

  /**
   * Set default options
   *
   * @param {Object} opt
   */

  _setDefaultsOptions(opt) {
    // Required
    this.url = opt.url;
    this.devUrl = opt.devUrl;
    this.username = opt.username;
    this.password = opt.password;
    this.appId = opt.appId;

    // Required for auto login
    this.company = opt.company;
    this.branch = opt.branch;
    this.module = opt.module;
    this.refId = opt.refId;

    // Optional
    this.logindate = opt.logindate;
    this.timezoneoffset = opt.timezoneoffset;

    // Settings
    this.sandbox = opt.sandbox || false;
    this.autoLogin = opt.autoLogin || false;
    this.loginObjs = opt.loginObjs || 0;
    this.encoding = opt.encoding || 'utf8';
    this.timeout = opt.timeout;
    this.axiosConfig = opt.axiosConfig || {};

    // Softone
    this.clientID = null;
  }
  /**
   * Parse params object.
   *
   * @param {Object} params
   * @param {Object} query
   */

  _parseParamsObject(params, query) {
    for (const key in params) {
      const value = params[key];

      if (typeof value === 'object') {
        for (const prop in value) {
          const itemKey = key.toString() + '[' + prop.toString() + ']';
          query[itemKey] = value[prop];
        }
      } else {
        query[key] = value;
      }
    }

    return query;
  }

  /**
   * Get URL
   *
   *
   * @return {String}
   */

  _getUrl() {
    if (this.sandbox) return this.devUrl;
    else {
      return this.url;
    }
  }

  /**
   * Do requests
   *
   * @param  {String} method
   * @param  {Object} data
   * @param  {Object} params
   *
   * @return {Object}
   */

  _request(method, data, params = {}, customEndPoint = '') {
    const url = this._getUrl() + customEndPoint;

    let options = {
      url: url,
      method: method,
      responseEncoding: this.encoding,
      timeout: this.timeout,
      responseType: 'arraybuffer',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=windows-1253',
        'User-Agent': 'Softone REST API - JS Client/' + this.classVersion,
      },
    };
    options.data = JSON.stringify(data);
    options.params = params;

    options = { ...options, ...this.axiosConfig };

    return axios(options);
  }
  /**
   * GET requests
   *
   * @param  {Object} data
   * @param  {Object} params
   * @param  {String} customEndPoint
   *
   * @return {Object}
   */

  async get(data, params = {}, customEndPoint = '') {
    return this.parseSoftOneResponse(
      this._request(
        'get',
        {
          appId: this.appId,
          ...(this.clientID && { clientID: this.clientID }),
          ...data,
        },
        params,
        customEndPoint
      )
    );
  }

  /**
   * POST requests
   *
   * @param  {Object} data
   * @param  {Object} params
   * @param  {String} customEndPoint
   *
   * @return {Object}
   */

  async post(data, params = {}, customEndPoint = '') {
    return this.parseSoftOneResponse(
      await this._request(
        'post',
        {
          appId: this.appId,
          ...(this.clientID && { clientID: this.clientID }),
          ...data,
        },
        params,
        customEndPoint
      )
    );
  }

  /**
   * LOGIN request
   *
   * @param  {Object} data
   * @param  {Object} params
   *
   * @return {Object}
   */
  async login(data, params = {}) {
    data = {
      service: 'login',
      username: this.username,
      password: this.password,
      appId: this.appId,
      ...(this.logindate && { logindate: this.logindate }),
      ...(this.timezoneoffset && { timezoneoffset: this.timezoneoffset }),
    };

    return this.parseSoftOneResponse(await this._request('post', data, params));
  }

  /**
   * AUTHENTICATE request
   *
   * @param  {Object} data
   * @param  {Object} params
   *
   * @return {Object}
   */

  async authenticate(data, params = {}) {
    data = {
      service: 'authenticate',
      clientID: this.clientID,
      COMPANY: this.company,
      BRANCH: this.branch,
      MODULE: this.module,
      REFID: this.refId,
      ...data,
    };

    return this.parseSoftOneResponse(await this._request('post', data, params));
  }

  /**
   * loginAuthenticate request
   *
   * @param  {Object} data
   * @param  {Object} params
   *
   * @return {Object}
   */

  async loginAuthenticate(data, params = {}) {
    if (!this.company) {
      throw new OptionsException('Company is required for loginAuthenticate');
    }

    if (!this.branch) {
      throw new OptionsException('Branch is required for loginAuthenticate');
    }

    if (!this.module) {
      throw new OptionsException('Module is required for loginAuthenticate');
    }

    if (!this.refId) {
      throw new OptionsException('Refid is required for loginAuthenticate');
    }

    data = {
      SERVICE: 'login',
      USERNAME: this.username,
      PASSWORD: this.password,
      APPID: this.appId,
      COMPANY: this.company,
      BRANCH: this.branch,
      MODULE: this.module,
      REFID: this.refId,
      ...(this.logindate && { logindate: this.logindate }),
      ...(this.timezoneoffset && { timezoneoffset: this.timezoneoffset }),
    };

    return this.parseSoftOneResponse(await this._request('post', data, params));
  }

  /**
   * loginAuthenticate request
   *
   */

  async setAutoLogin() {
    if (this.company && this.branch && this.module && this.refId) {
      const login = await this.loginAuthenticate();

      if (login.status == 200 && login.data.success) {
        this.clientID = login.data.clientID;
      }
    } else {
      const login = await this.login();

      if (login.status == 200 && login.data.success) {
        const authData = {
          clientID: login.data.clientID,
          COMPANY: this.company || login.data.objs[this.loginObjs].COMPANY,
          BRANCH: this.branch || login.data.objs[this.loginObjs].BRANCH,
          MODULE: this.module || login.data.objs[this.loginObjs].MODULE,
          REFID: this.refid || login.data.objs[this.loginObjs].REFID,
        };

        const authenticate = await this.authenticate(authData);

        if ((authenticate.status == 200) & authenticate.data.success) {
          this.clientID = authenticate.data.clientID;
        } else if (authenticate.status == 200 && !authenticate.data.success) {
          throw new OptionsException(
            'Softone authenticate failed.Softone Error : ' +
              authenticate.data.error
          );
        }
      } else if (login.status == 200 && !login.data.success) {
        throw new OptionsException(
          'Softone Login failed.Softone Error : ' + login.data.error
        );
      } else if (login.status != 200) {
        throw new OptionsException(
          'Softone Login failed.Request Error Code :' +
            login.status +
            '. Message :' +
            login?.error
        );
      }
    }
  }

  /**
   * parseSoftOneResponse request
   *
   * @param  {Object} response
   *
   * @return {Object}
   */
  parseSoftOneResponse(response) {
    const currentContentType = response.headers['content-type'];
    if (SoftOneContentType === currentContentType) {
      const data = iconv.decode(response.data, 'windows-1253');
      response.data = JSON.parse(data);
    } else {
      throw new Error(
        `ContentType ${currentContentType} different from ${SoftOneContentType}`
      );
    }
    return response;
  }
}
/**
 * Options Exception.
 */

module.exports = SoftoneRestApi;

class OptionsException {
  /**
   * Constructor.
   *
   * @param {String} message
   */
  constructor(message) {
    this.name = 'Options Error';
    this.message = message;
  }
}

exports.OptionsException = OptionsException;
