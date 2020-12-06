class ConsumeAndEarnService {
  constructor(cloud) {
    this.cloud = cloud;
    this.db = cloud.database();
  }

  async getCashbookVersionById(id) {
    return await this.db.collection('cashbook_version').where({ _id: id }).get();
  }

  async getAllConsumeAndEarnDetailByCashbookVersionId(id) {
    const cashbookVersionAndConsumeEarnRes = await this.db
      .collection('cashbook_version_and_consume_earn')
      .where({
        cashbookVersionId: id,
      })
      .get();
    const consumeAndEarnIds = cashbookVersionAndConsumeEarnRes.data.map((item) => item.consumeEarnId);
    const ResArr = [];
    for (let id of consumeAndEarnIds) {
      ResArr.push(await this.db.collection('consume_earn').where({ _id: id }).get());
    }
    const res = await Promise.all(ResArr);
    return res.map((item) => item.data[0]);
  }

  async createConsumeAndEarn(data) {
    const consumeEarnRes = await this.db.collection('consume_earn').add({
      data: {
        amount: data.amount,
        consumeTypeId: data.consumeTypeId || null,
        earnTypeId: data.earnTypeId || null,
        name: data.name || '',
        createTime: this.db.serverDate,
        updateTime: this.db.serverDate,
      },
    });
    const consumeEarnId = consumeEarnRes._id;
    await this.db.collection('cashbook_version_and_consume_earn').add({
      data: {
        consumeEarnId: consumeEarnId,
        cashbookVersionId: data.cashbookVersionId,
      },
    });
    console.log(consumeEarnId);
    return consumeEarnId;
  }
}

module.exports = ConsumeAndEarnService;
