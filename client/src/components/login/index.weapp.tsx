import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";

export default class Index extends Component {
  state = {
    context: {}
  };

  getLogin = () => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {}
      })
      .then(res => {
        console.log(res);
        this.setState({
          context: res.result
        });
      });
  };

  getUserInfo = res => {
    console.log(res.detail.userInfo.nickName);
    Taro.cloud
      .callFunction({
        name: "userInfo",
        data: {
          reqName: "update",
          data: {
            name: res.detail.userInfo.nickName
          }
        }
      })
      .then(res => {
        console.log(res);
      });
  };

  getCashbooks = () => {
    Taro.cloud
      .callFunction({
        name: "cashbook",
        data: {
          reqName: "getCashbooks"
        }
      })
      .then(res => {
        console.log(res);
      });
  };
  openapi = () => {
    Taro.cloud
      .callFunction({
        name: "cashbook",
        data: {
          reqName: "getCashbookBasicInfo",
          data: {
            id: "0a4429175fca0afb00be21b772179658"
          }
        }
      })
      .then(res => {
        console.log(res);
      });
  };
  getVersion = () => {
    Taro.cloud
      .callFunction({
        name: "cashbook",
        data: {
          reqName: "getCashbookLastest",
          data: {
            id: "0a4429175fca0afb00be21b772179658"
          }
        }
      })
      .then(res => {
        console.log(res);
      });
  };

  create = () => {
    Taro.cloud
      .callFunction({
        name: "cashbook",
        data: {
          reqName: "createCashbook",
          data: {
            name: "test1",
            recordInterval: "weekday"
          }
        }
      })
      .then(res => {
        console.log(res);
      });
  };

  createConsume = () => {
    Taro.cloud
      .callFunction({
        name: "cashbook",
        data: {
          reqName: "createConsumeAndEarn",
          data: {
            cashbookVersionId: "b1a52c595fcc8833011b92b03a2df66e",
            name: "cehsi",
            consumeTypeId: "c89bd61c5fca082000b0d368797b9dcb",
            amount: -11
          }
        }
      })
      .then(res => {
        console.log(res);
      });
  };
  createEarn = () => {
    Taro.cloud
      .callFunction({
        name: "cashbook",
        data: {
          reqName: "createConsumeAndEarn",
          data: {
            cashbookVersionId: "b1a52c595fcc8833011b92b03a2df66e",
            name: "cehsi",
            earnTypeId: "b1a52c595fca0a8f00f9c1213e2de1f5",
            amount: 11
          }
        }
      })
      .then(res => {
        console.log(res);
      });
  };

  render() {
    return (
      <View className="index">
        <Button onClick={this.getLogin}>获取登录云函数</Button>
        <Button openType="getUserInfo" onGetUserInfo={this.getUserInfo}>
          获取用户信息
        </Button>
        <Button onClick={this.getCashbooks}>获取cashbooks基础信息</Button>
        <Button onClick={this.openapi}>获取cashbook基础信息</Button>
        <Button onClick={this.getVersion}>获取cashbook最新version</Button>
        <Button onClick={this.create}>创建cashbook</Button>
        <Button onClick={this.createConsume}>创建收支记录</Button>
        <Button onClick={this.createEarn}>创建收支记录</Button>
        <Text>context：{JSON.stringify(this.state.context)}</Text>
      </View>
    );
  }
}
