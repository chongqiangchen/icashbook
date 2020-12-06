const cloud = require('wx-server-sdk');
const CashbookService = require('./cashbook.service');
const ConsumeAndEarnService = require('./consume-earn.service');
const { BaseErrorRes, BaseRes, BaseSuccessRes, BaseAuthRes } = require('./utils');

cloud.init({
  env: 'icashbook-cloud-9g3nlo4rde137f46',
});
const db = cloud.database();

const cashbookService = new CashbookService(cloud);
const consumeAndEarnService = new ConsumeAndEarnService(cloud);

const controller = async (reqName, data, context) => {
  switch (reqName) {
    case 'getCashbooks':
      return await getCashbooks(data, context);
    case 'getCashbookBasicInfo':
      return await getCashbookBasicInfo(data, context);
    case 'getCashbookLastest':
      return await getCashbookLastest(data, context);
    case 'createCashbook':
      return await createCashbook(data, context);
    case 'createConsumeAndEarn':
      return await createConsumeAndEarn(data, context);
    default:
      return BaseErrorRes('请求名不存在');
  }
};

const getCashbooks = async (data, context) => {
  const openId = cloud.getWXContext().OPENID;
  const res = await cashbookService.getCashbooks(openId);

  return {
    ...BaseSuccessRes(),
    list: res,
  };
};

const getCashbookBasicInfo = async (data, context) => {
  const { id } = data;
  const cashbook = await cashbookService.getCashbookById(id);
  const list = await cashbookService.getCashbookVersionIdsById(id);
  if (!cashbook) {
    return BaseErrorRes('查找内容不存在');
  }

  return {
    ...BaseSuccessRes('请求成功'),
    data: {
      ...cashbook.data[0],
      list: list.data,
    },
  };
};

const getCashbookLastest = async (data, context) => {
  const { id } = data;
  const cashbook = await cashbookService.getCashbookById(id);
  const cashVersion = await consumeAndEarnService.getCashbookVersionById(cashbook.data[0].lastVersionId);
  const allConsumeEarns = await consumeAndEarnService.getAllConsumeAndEarnDetailByCashbookVersionId(
    cashbook.data[0].lastVersionId
  );

  return {
    ...BaseSuccessRes('请求成功'),
    data: {
      ...cashVersion,
      list: allConsumeEarns,
    },
  };
};

const createCashbook = async (data, context) => {
  const openId = cloud.getWXContext().OPENID;
  const res = await cashbookService.createCashbook(data, openId);
  return {
    ...BaseSuccessRes('请求成功'),
    data: res,
  };
};

const createConsumeAndEarn = async (data, context) => {
  const { cashbookVersionId, consumeTypeId, earnTypeId } = data;
  if (!cashbookVersionId) return BaseErrorRes('请求参数cashbookVersionId不能为空');
  if (consumeTypeId && earnTypeId) return BaseErrorRes('不允许一个收支记录存在两种互斥类别');

  const res = await consumeAndEarnService.createConsumeAndEarn(data);

  return {
    ...BaseSuccessRes(),
    data: res,
  };
};

exports.main = async (event, context) => {
  const openId = cloud.getWXContext().OPENID;
  console.log(openId);
  if (!openId) return BaseAuthRes();

  const { reqName, data } = event;

  if (!reqName) {
    return BaseErrorRes(-1, '请求名不允许为空');
  }

  return await controller(reqName, data, context);
};
