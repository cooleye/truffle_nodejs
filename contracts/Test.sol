pragma solidity ^0.4.16;


contract Test {

    uint age;

    function Test() public {
        age = 5;
    }
    
    function sayHi() constant returns (string) {
        return "你好，迪丽热巴";
    }

    function sayBye() returns (string) {
        return "再见，我的热巴";
    }

    function getAge(uint a) public returns(uint) {
        return age + a;
    }
}