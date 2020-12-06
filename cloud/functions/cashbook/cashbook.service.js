const { BaseSuccessRes } = require('./utils');

class CashbookService {
  constructor(cloud) {
    this.cloud = cloud;
    this.db = cloud.database();
  }

  async getCashbooks(openId) {
    const openIdAndCashbookIdRes = await this.db
      .collection('user_and_cashbook')
      .where({
        openId,
      })
      .get();
    const cashbookIds = openIdAndCashbookIdRes.data.map((item) => item.cashbookId);
    console.log(cashbookIds);
    const AllRes = [];
    for (let id of cashbookIds) {
      AllRes.push(await this.getCashbookById(id));
    }
    const res = await Promise.all(AllRes);
    return res.map((item) => item.data[0]);
  }

  async getCashbookById(id) {
    return await this.db.collection('cashbook').where({ _id: id }).get();
  }

  async getCashbookVersionIdsById(id) {
    return await this.db.collection('cashbook_and_cashbook_version').where({ cashbookId: id }).get();
  }

  async createCashbook(data, openId) {
    const versionRes = await this.db.collection('cashbook_version').add({
      data: {
        createTIme: this.db.serverDate,
        updateTime: this.db.serverDate,
        totalAmount: 0,
      },
    });
    const versionId = versionRes._id;
    const cashbookRes = await this.db.collection('cashbook').add({
      data: {
        createTime: this.db.serverDate,
        updateTime: this.db.serverDate,
        name: data.name || '',
        recordInterval: data.recordInterval,
        lastVersionId: versionId,
      },
    });
    const cashbookId = cashbookRes._id;
    await this.db.collection('cashbook_and_cashbook_version').add({
      data: {
        cashbookId,
        cashbookVersionId: versionId,
      },
    });
    await this.db.collection('user_and_cashbook').add({
      data: {
        cashbookId,
        openId,
      },
    });
    return cashbookId;
  }
}

module.exports = CashbookService;

// const getCashbook = async (event, context) => {
//   const { id: cashbookId } = event;
//   const cashbook = await db.collection('cashbook').where({ _id: cashbookId }).get();
//   // const conmuseEarnIds = await db
//   //   .collection('cashbook_consume_earn_relation')
//   //   .where({
//   //     cashbook_id: cashbookId,
//   //   })
//   //   .get()
//   //   .then((res) => {
//   //     console.log(res);
//   //     return res.data.map((item) => item['consume_earn_id']);
//   //   });
//   // console.log(conmuseEarnIds);
//   const allReq = [];
//   // conmuseEarnIds.forEach((id) => {
//   //   allReq.push(db.collection('consume_earn').where({ _id: id }).get());
//   // });

//   // const arr = await Promise.all(allReq);
//   return {
//     ...cashbook,
//     data: [],
//   };
// };
