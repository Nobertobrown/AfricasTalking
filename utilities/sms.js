const dotenv = require('dotenv');
dotenv.config();
const Africastalking = require('africastalking')({
    apiKey: "e3d3cb9a5145be2236ec73e8575855296448d4af30c7b147da62060b21599bf0",         // use your sandbox app API key for development in the test environment
    username: 'sandbox',      // use 'sandbox' for development in the test environment
});

// Initialize a service e.g. SMS
const sms = Africastalking.SMS

// Send message and capture the response or error
const sendSms = async ({ phone, message }) => {
    // Use the service
    const options = {
        to: [phone],
        message: message
    }
    const res = await sms.send(options)
    return res;
}

exports.sendSms = sendSms;