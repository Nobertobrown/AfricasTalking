require("dotenv").config();
const Africastalking = require("africastalking")({
  apiKey: process.env.AFRICAS_TALKING_API, // use your sandbox app API key for development in the test environment
  username: "sandbox", // use 'sandbox' for development in the test environment
});

// Initialize a service e.g. SMS
const sms = Africastalking.SMS;

// Send message and capture the response or error
const sendSms = async ({ phone, message }) => {
  // Use the service
  const options = {
    to: [phone],
    message: message,
  };
  const res = await sms.send(options);
  return res;
};

exports.sendSms = sendSms;
