const BaseRes = (code, message) => {
  // code = 0时，无错误， code = -1时，错误
  return {
    code,
    message,
  };
};

const BaseErrorRes = (message) => {
  return BaseRes(-1, message);
};

const BaseSuccessRes = (message) => {
  return BaseRes(0, message || '请求成功');
};

const BaseAuthRes = () => {
  return BaseRes(-2, '请先登录');
};

module.exports = {
  BaseRes,
  BaseErrorRes,
  BaseSuccessRes,
  BaseAuthRes,
};
