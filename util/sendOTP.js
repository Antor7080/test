module.exports.sendOTP = async (phoneNumber, verificationCode) => {
    const rp = require('request-promise-native');
    const options = {
        method: 'POST',
        url: `http://bulksmsbd.net/api/smsapi?api_key=yM8a1krnnpTmXccYJw6X&type=text&number=${phoneNumber}&senderid=8809617611017&message=Welcome to GUB Reporting System. Your verification code is ${verificationCode} . Please do not share this code with anyone.
         Thank you.`,
        json: true
    };
    const response = await rp(options);

    return response;

}

exports.sendMessage=async (phoneNumber, message) => {
console.log(phoneNumber, message);
    const rp = require('request-promise-native');
    const options = {
        method: 'POST',
        url: `http://bulksmsbd.net/api/smsapi?api_key=yM8a1krnnpTmXccYJw6X&type=text&number=${phoneNumber}&senderid=8809617611017&message=${message}
         Thank you.`,
        json: true
    };
    const response = await rp(options);
console.log(response);
    return response;
}  