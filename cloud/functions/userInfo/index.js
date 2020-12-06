const cloud = require('wx-server-sdk');
cloud.init({
  env: 'icashbook-cloud-9g3nlo4rde137f46',
});
const db = cloud.database();

const controller = async (reqName, data, context) => {
  switch (reqName) {
    case 'update':
      return await updateUserInfo(data, context);
    default:
      break;
  }
};

const updateUserInfo = async (data, context) => {
  const { name } = data;
  const openId = cloud.getWXContext().OPENID;
  const res = await db
    .collection('user')
    .where({
      openId,
    })
    .update({
      data: {
        name,
      },
    });
  return {
    data: res,
  };
};

exports.main = async (event, context) => {
  const { reqName, data } = event;

  if (!reqName) {
    return BaseErrorRes('请求名不允许为空');
  }

  return await controller(reqName, data, context);
};
