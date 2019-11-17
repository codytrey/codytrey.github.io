const request = require('request');
const process = require('process');
const apiKey = process.env.API_KEY;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

process.on('SIGINT', () => {
  console.info("Received SIGINT")
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.info("Received SIGTERM")
  process.exit(0)
})

process.on('SIGHUP', () => {
  console.info("Received SIGHUP")
  process.exit(0)
})

process.on('SIGQUIT', () => {
  console.info("Received SIGQUIT")
  process.exit(0)
})

process.on('SIGABRT', () => {
  console.info("Received SIGHUP")
  process.exit(0)
})

process.on('SIGHUP', () => {
  console.info("Received SIGABRT")
  process.exit(0)
})

process.on('SIGUSR1', () => {
  console.info("Received SIGUSR1")
  process.exit(0)
})

process.on('SIGUSR2', () => {
  console.info("Received SIGUSR2")
  process.exit(0)
})

app.set('view engine', 'ejs')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  request(url, function (err, response, body) {
      if(err){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weather = JSON.parse(body)
        if(weather.main == undefined){
          res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
          let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
          res.render('index', {weather: weatherText, error: null});
        }
      }
    });
  })

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})