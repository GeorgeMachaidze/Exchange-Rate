const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const https = require("https");


const fs = require('fs');
const cheerio = require('cheerio');

const app = express();
const html = fs.readFileSync('index.html', 'utf-8');

const $ = cheerio.load(html);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html")
})
app.post("/",function(req,res){

  var amount = req.body.amount;


  const url = "https://api.fastforex.io/fetch-all?from=GEL&api_key=3325c79170-47513639cd-rqnqjv"

  https.get(url, function(response){
    console.log(response.statusCode);
    let rawData = ''
    response.on("data", function(data){
      rawData = `${rawData}${data}`
    })
    response.on("end", function() {
      const apidata = JSON.parse(rawData)
      const  dolari = amount * apidata.results.USD
      const  girvanqa = amount * apidata.results.GBP
      const  euro = amount * apidata.results.EUR
      const  rubli = amount * apidata.results.RUB

      $('#dolari').text(dolari);
      $('#girvanqa').text(girvanqa);
      $('#euro').text(euro);
      $('#rubli').text(rubli);
      fs.writeFileSync('index.html', $.html(), 'utf-8');
      res.sendFile(__dirname + "/index.html")
    })
  })
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server running on port 3000")
})
