const http = require("http");
const fs = require("fs");
var requests = require("requests");

const weatherHtml = fs.readFileSync( "weather.html" , "utf-8");

const replaceVal = (tempVal , orgVal) => {

    let temperature = tempVal.replace("{%tempval%}" , orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}" , orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}" , orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}" , orgVal.name);
    temperature = temperature.replace("{%country%}" , orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}" , orgVal.weather[0].main);

    return temperature;



};



const server = http.createServer((req , res) =>{

    if(req.url == "/") {

        requests(
         "https://api.openweathermap.org/data/2.5/weather?q=Varanasi&appid=3a9d5e3b1f61870618e4bb7b835dda70", 
        )
.on("data", (chunk) => {

    const objData = JSON.parse(chunk);
    const arrData = [objData];
  //console.log(arrData);
  const realTimeData = arrData.map((val) => replaceVal(weatherHtml , val)).join("");

  res.write(realTimeData);
  //console.log(realTimeData);


    //console.log(val.main);
    //replaceVal(weatherHtml , val);
})
.on("end", (err) => {
  if (err) return console.log("connection closed due to errors", err);
  res.end();
 
  //console.log("end");
});

    }
});

server.listen(8000 , "127.0.0.1");