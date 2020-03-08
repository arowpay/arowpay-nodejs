# arowpay-nodejs

> NPM module for acquiring payments from the Arowpay API without form authentication hassle.

## Install

```sh
npm install arowpay-nodejs
```

## Requirements
This package builds upon the fact that a correct pair of appkey and appsecret are provided. You can generate these [Here](https://docs.arowpay.com/ipnsetting.html)

## Usage
How to initialize the module with the correct data.

```javascript
const arowpay = require('arowpay-nodejs');

const options = {
	appkey: "", 
	appsecret: ""
};

const payments = new arowpay(options, (err, result) => {
	if(err) throw err;
	console.log(result); 
	// Configured successfully
});
```

## Create a callback address
By specifying the sending currency, a unique deposit address will be returned to you.
```javascript
//BTC ETH USDTERC20
const options = {currency:"BTC",custom:"customStrings"}
payments.callApi("getCallbackAddress",options, (err, result) => {
	if(err) throw err;
	console.log(result);
});
```

## Validate IPNs
Check the data structure on https://docs.arowpay.com/ipn.html

A demo IPN sent to callback url
````
HTTP Header:
Content-Type:application/json
nonce:102221
timestamp:1581582671
appkey:yourappkey
signature:632667547e7cd3e0466547863e1207a8c0c0c549

HTTP Body Content :
{"txid":"c85d2669ac777574762640c36e66592df946aa90615952797d62c9070cebbeb5","address":"1PJb6kLcZjUeq4fkKJ6ubDnEbx8ELJyRfd","amount":"0.0051","currency":"BTC","time":1581582672,"custom":"yourcustomstrings"}
````
Validate
```javascript
//BTC ETH USDTERC20
const validateresult = payments.validateIPN(appkey,signature,nonce,timestamp,txid,amount,currency);
if(validateresult == true){
	//valid IPN , process the vars
}

```
