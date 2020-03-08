const querystring = require('querystring');
const request = require('request');
const crypto = require('crypto');

module.exports = arowpay;

/**
 * Initialize module
 * @param {Object} options {appsecret: "", appkey: ""}
 * @param {Function} callback Callback (err, result)
 */
function arowpay(options, callback) {
    if(!options.appkey) return callback('Please provide a appkey.');
    if(!options.appsecret) return callback('Please provide a appsecret.');
    this.data = {
        appkey: options.appkey,
        appsecret: options.appsecret
    }

    return callback(null, 'Configured successfully')
}


/**
 * Create a callback/deposit address
 * @param {String} currency Specify currency type.
 * @param {Function} callback Callback (err, result)
 */
arowpay.prototype.getCallbackAddress = function(cmd,options,callback){
	var formData = querystring.stringify(options);
	const nonce = (parseInt(Math.random() * 0xffffff)).toString();
	const timestamp = (Date.parse(new Date()) / 1000).toString();
    const signature = crypto.createHash('sha1').update(this.data.appsecret+nonce+timestamp).digest('hex').toLowerCase();
	request({
		rejectUnauthorized :false,
		uri: 'https://api.arowpay.io/'+cmd,
		method: 'POST',
		headers: {
			'Content-Length': formData.length,
			'Content-Type': 'application/x-www-form-urlencoded',
			'appkey':this.data.appkey,
			'nonce': nonce,
			'timestamp': timestamp,
			'signature':signature
		},
		body: formData
	}, (err, res, body) => {
		if(err) return callback(err);
    	return callback(null, body);
	});
}

arowpay.prototype.validateIPN = function(appkey,signature,nonce,timestamp,txid,amount,currency){
   if(appkey!=this.data.appkey){
   	  return false;
   }
   const checkSignature = crypto.createHash('sha1').update(this.data.appsecret+nonce+timestamp+txid+amount+currency).digest('hex').toLowerCase();
   if(signature.toLowerCase()!=checkSignature){
   	  return false;
   }
   return true;
}





