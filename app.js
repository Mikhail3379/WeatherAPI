const express = require("express");
const https = require("https");
var bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  console.log("Post recieved");
  const city = req.body.cityName;
  const endPoint = "https://api.openweathermap.org/data/2.5/weather?";
  const apiKey = "d824926bc74e67c4c37c07d780d2a456";
  const tempUnit = "metric";
  const url = endPoint+ "units="+ tempUnit + "&q=" + city + "&appid=" + apiKey;

  https.get(url, function(response){
    console.log(response.statusCode);
    response.on("data", function(data){

      const weatherData = JSON.parse(data);
      if(weatherData.cod === 200){
        const currentTemp = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const weatherIconCode = weatherData.weather[0].icon;
        const weatherImageURL = 'http://openweathermap.org/img/wn/'+ weatherIconCode +'@2x.png';

        res.write("<h1>Current temperature in "+ weatherData.name +" is " + currentTemp + " degree Celcius</h1>");
        res.write(description);
        res.write("<br><img src="+ weatherImageURL +">");

        res.send();
      }else{
        res.send("Cannot find that city(" + city + ")please return to previous page to try again");
      }

    });
  });
});

app.listen(3000, function(){
  console.log("Server is running at port 3000");
});
