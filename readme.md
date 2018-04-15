接上一篇
# 创建工程
```
mkdir truffle_node
cd truffle_node/
```
##### truffle 初始化
```
truffle init
Downloading...
Unpacking...
Setting up...
Unbox successful. Sweet!

Commands:

  Compile:        truffle compile
  Migrate:        truffle migrate
  Test contracts: truffle test
```
##### NPM初始化
truffle console命令会默认集成web3，合约抽象层。如果想要在自已的NodeJS环境使用Truffle合约，就要手动集成这两个模块。在集成前，我们需要创建工程的npm包管理环境，首先进入工程目录，使用npm init来初始化工程的npm包管理环境：
```
npm init -y
```
##### 安装 [truffle-contract](https://github.com/trufflesuite/truffle-contract)
这个工具是Truffle提供的，用于在NodeJS和浏览器中集成Truffle的合约抽象运行环境
```
npm install --save  truffle-contract
npm WARN saveError ENOENT: no such file or directory, open '/Users/kongdejian/package.json'
npm WARN enoent ENOENT: no such file or directory, open '/Users/kongdejian/package.json'
npm WARN solc-cli@0.3.0 requires a peer of solc@^0.3.5 but none is installed. You must install peer dependencies yourself.
npm WARN kongdejian No description
npm WARN kongdejian No repository field.
npm WARN kongdejian No README data
npm WARN kongdejian No license field.

+ truffle-contract@3.0.4
added 24 packages in 89.205s
```
##### 安装NodeJS中用到的Truffle运行时需要的web3环境
```
npm install --save web3
```
# 创建自己的合约文件
在truffle3/contracts目录下创建测试合约文件Test.sol
```
pragma solidity ^0.4.16;


contract Test {
    
    function sayHi() returns (string) {
        return "你好，迪丽热巴";
    }

    function sayBye() returns (string) {
        return "再见，我的热巴";
    }
}
```
# deploy配置
增加`migrations/2_deploy_contracts.js`配置
```
var Test = artifacts.require("./Test.sol");

module.exports = function(deployer) {
  deployer.deploy(Test);
};
```

# 启动以太坊
```
truffle develop
```
或者
```
testrpc
```
注意端口不一样，testrpc端口是8545，truffle develop端口是9545

# 编译合约
```
truffle compile
```
# 移植
```
truffle migrate --reset
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/Test.sol...

Writing artifacts to ./build/contracts

Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x0cb2a16f6c07f1aa38b77c2d395866a8f7302dc2d98820380580bd92a8549631
  Migrations: 0x82d50ad3c1091866e258fd0f1a7cc9674609d254
Saving successful migration to network...
  ... 0x289ae161be6b6cdcea57476a531d45daf5e590a20fecca05e88e1bf699ba2558
Saving artifacts...
Running migration: 2_deploy_migration.js
  Deploying Test...
  ... 0xa32d701de86bd69078db3b6000538205b8085466a1afab664f280e8d324a77c8
  Test: 0xeec918d74c746167564401103096d45bbd494b74
Saving successful migration to network...
  ... 0x7481b74f273c73b55d9bd16286d7ea81f72589feb840275a0731ca03f1e7f7b9
Saving artifacts...
```

# 在Nodejs中调用合约
代码
```
var Web3 = require('web3');
var contract = require("truffle-contract");

//引入编合约编译后的json
var TestContract = require('../build/contracts/Test.json');

var provider = new Web3.providers.HttpProvider("http://localhost:8545");


//使用truffle-contract包的contract()方法
//请务必使用你自己编译的.json文件内容
var Test = contract(TestContract);


//Unhandled rejection Error: Provider not set or invalid
Test.setProvider(provider);


// Test.setNetwork(4447)


//(node:32969) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'apply' of undefined
Test.currentProvider.sendAsync = function () {
    return Test.currentProvider.send.apply(Test.currentProvider, arguments);
};


//没有默认地址，会报错
//UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 3): Error: invalid address
//务必设置为自己的钱包地址，如果不知道，查看自己的客户端启动时，观察打印到控制台的地址
Test.defaults({
  from : "0x3ac614295b1e9736f83d7758c956fed1adf612bd",
  gas: 4712388, gasPrice: 100000000000
});

//通过合约地址获得合约实例
// var inst = Test.at('0x3ac614295b1e9736f83d7758c956fed1adf612bd')
// .then(function(instance){
//   deployed = instance;
//   return instance.sayHi.call()
// })
// .then(function(result){
//   console.log(result);
//   return deployed.sayBye.call()
// })
// .then(function(result){
//   console.log(result)
// })
// //不写catch会报错
// //UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
// .catch(function(err) {
//    console.log(err)
// });



var deployed;
Test.deployed()
.then(function(instance){
  deployed = instance;
  return instance.sayHi.call()
})
.then(function(result){
  console.log(result);
  return deployed.sayBye.call()
})
.then(function(result){
  console.log(result)
})
//不写catch会报错
//UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
.catch(function(err) {
   console.log(err)
});

```
修改 package.json
在 scripts中添加一个start
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start":"node ./src/index.js"
  },
```
运行程序
```
npm start
> truffle_node@1.0.0 start /Users/someone/Desktop/truffle_node
> node ./src/index.js

你好，迪丽热巴
再见，我的热巴
```
# 代码详解
首先引入`web3`和`truffle-contract`.并初始化一个实例Web3，并为实例设置了HttpProvider。
```
var Web3 = require('web3');
var contract = require("truffle-contract");

//引入编合约编译后的json
var TestContract = require('../build/contracts/Test.json');

var provider = new Web3.providers.HttpProvider("http://localhost:8545");


//使用truffle-contract包的contract()方法
//请务必使用你自己编译的.json文件内容
var Test = contract(TestContract);


//Unhandled rejection Error: Provider not set or invalid
Test.setProvider(provider);
```

##### truffle-contract的contract()方法
要在NodeJS初始化Truffle编译好的合约，要使用contract()方法。将Truffle编译后的.json文件，一般在build/contracts/Test.json。将此文件的内容放入contract()的括号内。这里我使用require加载进来，也有人使用fs模块读取json，也可以。

#### 默认帐户地址
部署合约和执行消息调用需要消耗gas，truffle-contract框架默认没有读取coinbase的默认地址，所以我们需要主动设置下
```
Test.defaults({
  from : "0x3ac614295b1e9736f83d7758c956fed1adf612bd",
  gas: 4712388, gasPrice: 100000000000
});
```
# 踩过的坑
这里有几个坑需要注意下
如果出现这个错误
`
//(node:32969) UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'apply' of undefined
`
我们可以添加如下代码
```
Test.currentProvider.sendAsync = function () {
    return Test.currentProvider.send.apply(Test.currentProvider, arguments);
};
```
参考
https://github.com/trufflesuite/truffle-contract/issues/56

在一个是`then`后边必须写`catch`,否则汇报这个错误
`//UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)`

