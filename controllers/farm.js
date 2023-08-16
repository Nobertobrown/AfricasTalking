const https = require("https");
require("dotenv").config();

const Africastalking = require("africastalking")({
  apiKey: process.env.AFRICAS_TALKING_API, // use your sandbox app API key for development in the test environment
  username: "sandbox", // use 'sandbox' for development in the test environment
});

// Initialize a service e.g. SMS
const sms = Africastalking.SMS;

exports.getHomePage = (req, res) => {
  res.render("interface/index", { pageTitle: "Home" });
};

exports.getWeatherPage = (req, res) => {
  res.render("interface/weather");
};

exports.getPayementPage = (req, res) => {
  res.render("interface/payement");
};

exports.sendMessage = (req, res) => {
  let weatherData, temperature, description, icon, rain;
  let url =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&lat=-6.776012&lon=39.178326&appid=" +
    process.env.OPEN_WEATHER_MAP_API;
  https.get(url, function (response) {
    response.on("data", function (data) {
      weatherData = JSON.parse(data);
      temperature = weatherData.main.temp;
      icon = weatherData.weather[0].icon;
      description = weatherData.weather[0].description;
      let image = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      // Send message and capture the response or error
      const sendSms = async () => {
        // Use the service
        const options = {
          to: ["+255748281617"],
          message:
            "The current temperature is " +
            temperature +
            "degrees Celcius, it is " +
            description,
        };
        const res = await sms.send(options);
        console.log(res);
      };

      sendSms();
      res.render("interface/weather", {
        temp: temperature,
        desc: description,
        img: image,
      });
    });
  });

  // setInterval(() => {
  //     sendSms({ phone: "+255748281617", message: "This is a message" }).then((result) => {
  //         console.log(result)
  //     }).catch((err) => {
  //         console.log(err)
  //     });
  // }, 60 * 1000);
};
