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
  return deployed.getAge.call(10)
})
.then(function(result){
  console.log(result)
})
//不写catch会报错
//UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
.catch(function(err) {
   console.log(err)
});
