var assert = require('assert');
const SoftoneRestApi = require('./index');
var expect = require('chai').expect;

describe('Softone Testing 1 (Manual Login)', function () {
  const softone = new SoftoneRestApi({
    url: 'https://demo.oncloud.gr/',
    username: 'demo',
    password: 'demo',
    appId: 157,
  });

  let login;
  let authenticate;
  let getBrowserInfo;
  let getBrowserData;

  describe('Softone Login', function () {
    before(async function () {
      login = await softone.login();
    });

    it('Login return status 200', function () {
      expect(login.status).to.equal(200);
    });

    it('Login response success = true', function () {
      expect(login.data.success).to.equal(true);
    });
  });

  describe('Softone Authenticate', function () {
    before(async function () {
      const authData = {
        clientID: login.data.clientID,
        COMPANY: login.data.objs[0].COMPANY,
        BRANCH: login.data.objs[0].BRANCH,
        MODULE: login.data.objs[0].MODULE,
        REFID: login.data.objs[0].REFID,
      };

      authenticate = await softone.authenticate(authData);
    });

    it('Authenticate return status 200', function () {
      expect(authenticate.status).to.equal(200);
    });

    it('Authenticate response success = true', function () {
      expect(authenticate.data.success).to.equal(true);
    });
  });

  describe('getBrowserInfo', function () {
    before(async function () {
      const data = {
        service: 'getBrowserInfo',
        clientID: authenticate.data.clientID,
        OBJECT: 'CUSTOMER',
        LIST: '',
        FILTERS: '',
      };

      getBrowserInfo = await softone.post(data);
    });

    it('getBrowserInfo return status 200', function () {
      expect(getBrowserInfo.status).to.equal(200);
    });

    it('getBrowserInfo response success = true', function () {
      expect(getBrowserInfo.data.success).to.equal(true);
    });
  });

  describe('getBrowserData', function () {
    before(async function () {
      const data = {
        service: 'getBrowserInfo',
        clientID: authenticate.data.clientID,
        reqID: getBrowserInfo.data.reqID,
        START: 0,
        LIMIT: 100,
      };

      getBrowserData = await softone.post(data);
    });

    it('getBrowserData return status 200', function () {
      expect(getBrowserData.status).to.equal(200);
    });

    it('getBrowserData response success = true', function () {
      expect(getBrowserData.data.success).to.equal(true);
    });
  });

  after('', async function () {
    console.log();
    console.log('--------------------');
    console.log(
      `getBrowserInfo totalcount : ${getBrowserInfo?.data?.totalcount}`
    );
    console.log(`getBrowserData count : ${getBrowserData?.data?.rows?.length}`);
    console.log('--------------------');
  });
});

describe('Softone Testing 2 (Auto Login)', function () {
  const softone = new SoftoneRestApi({
    url: 'https://demo.oncloud.gr',
    username: 'demo',
    username: 'demo',
    password: 'demo',
    appId: 157,
  });

  let setData;

  describe('Softone create customer', function () {
    before(async function () {
      await softone.setAutoLogin();

      const data = {
        service: 'setData',
        OBJECT: 'CUSTOMER',
        FORM: 'SOne',
        data: {
          CUSTOMER: [
            {
              NAME: 'Softone REST API test',
              AFM: '999863881',
              IRSDATA: 'IV Athens',
              EMAIL: 'johng@softone.gr',
              WEBPAGE: 'www.softone.gr',
              PHONE01: '+302109484797',
              PHONE02: '+302108889999',
              FAX: '9484094',
              ADDRESS: '6 Poseidonos street',
              ZIP: '17674',
              DISTRICT: 'Kallithea',
              DISCOUNT: 10,
              REMARKS: 'Hello World!',
            },
          ],
          CUSEXTRA: [
            {
              VARCHAR01: 'Extra 1',
              VARCHAR02: 'Extra 2',
            },
          ],
        },
      };
      setData = await softone.post(data);

      if (!setData.data.success) {
        console.log(`Softone error message: ${setData.data.error}`);
      }
    });

    it('setData return status 200', function () {
      expect(setData.status).to.equal(200);
    });

    it('setData response success = true', function () {
      expect(setData.data.success).to.equal(true);
    });
  });

  after('', async function () {
    console.log();
    console.log('--------------------');
    console.log(`Create customer with id: ${setData.data.id}`);
    console.log('--------------------');
  });
});
