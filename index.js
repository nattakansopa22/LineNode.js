var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var mqtt = require('mqtt');
// Your Channel access token (long-lived) 
const CH_ACCESS_TOKEN = 'PrEXTPeWFFBKhqPxCjRz1+tKJ76bSTmkKkzVE3UwSBcMedaupGVzEWZGffy/j6iUanH2mt+jri8nLCtOgX8QTZCRD7fmo1QIIIwZ0ikCt7bwbUx6pm7GPxPQt8UNFKbuqEZfp364rzhmKQvRZVgsFAdB04t89/1O/w1cDnyilFU=';
// MQTT Host
var mqtt_host = 'mqtt://hairdresser.cloudmqtt.com';
// MQTT Topic
var mqtt_topic = '/ESP32';
// MQTT Config
var options = {
    port: 16093,
    host: 'mqtt://hairdresser.cloudmqtt.com',
    clientId: 'Kan' + Math.random().toString(16).substr(2, 8),
    username: 'qtjwedau',
    password: 'pSYbwv9cIIWS',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 4000))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.post('/webhook', (req, res) => {
  var text = req.body.events[0].message.text.toLowerCase()
  var sender = req.body.events[0].source.userId
  var replyToken = req.body.events[0].replyToken
  console.log(text, sender, replyToken)
  console.log(typeof sender, typeof text)
  // console.log(req.body.events[0])
  if (text === 'info' || text === 'รายงาน') {
    // Info
    inFo(sender, text)
  }
  else if (text === '1' || text === 'เปิด' || text === 'start') {
    // LED On
    ledOn(sender, text)
  }
  else if (text === '0' || text === 'ปิด' || text === 'stop') {
    // LED Off
    ledOff(sender, text)
  }
  else {
    // Other
    sendText(sender, text);
  }
  res.sendStatus(200)
})
function sendText (sender, text) {
  let data = {
    to: sender,
    messages: [
      {
        type: 'text',
        text: 'กรุณาพิมพ์ : 0|1  :  ปิด|เปิด   :   start|stop'
      }
    ]
  }
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+CH_ACCESS_TOKEN+''
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function (err, res, body) {
    if (err) console.log('error')
    if (res) console.log('success')
    if (body) console.log(body)
  })
}
function inFo (sender, text) {
  let data = {
    to: sender,
    messages: [
      {
        type: 'text',
        text: 'uid: '+sender
      }
    ]
  }
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+CH_ACCESS_TOKEN+''
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function (err, res, body) {
    if (err) console.log('error')
    if (res) console.log('success')
    if (body) console.log(body)
  })
}
function ledOn (sender, text) {
  var client = mqtt.connect(mqtt_host, options);
  client.on('connect', function() { // When connected
      console.log('MQTT connected');
      // subscribe to a topic
      client.subscribe(mqtt_topic, function() {
          // when a message arrives, do something with it
          client.on('message', function(topic, message, packet) {
              console.log("Received '" + message + "' on '" + topic + "'");
          });
      });
      
      // publish a message to a topic
      client.publish(mqtt_topic, 'on', function() {
          console.log("Message is published");
          client.end(); // Close the connection when published
      });
      
  });
    
  let data = {
    to: sender,
    messages: [
      {
        type: 'text',
        text: 'สตาร์ทรถให้เรียบร้อยแล้วครับ'
      }
    ]
  }
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+CH_ACCESS_TOKEN+''
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function (err, res, body) {
    if (err) console.log('error')
    if (res) console.log('success')
    if (body) console.log(body)
  })
}
function ledOff (sender, text) {
  var client = mqtt.connect(mqtt_host, options);
  client.on('connect', function() { // When connected
      console.log('MQTT connected');
      // subscribe to a topic
      client.subscribe(mqtt_topic, function() {
          // when a message arrives, do something with it
          client.on('message', function(topic, message, packet) {
              console.log("Received '" + message + "' on '" + topic + "'");
          });
      });
      
      // publish a message to a topic
      client.publish(mqtt_topic, 'off', function() {
          console.log("Message is published");
          client.end(); // Close the connection when published
      });
      
  });
  let data = {
    to: sender,
    messages: [
      {
        type: 'text',
        text: 'ดับรถให้เรียบร้อยแล้วครับท่าน'
      }
    ]
  }
  request({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+CH_ACCESS_TOKEN+''
    },
    url: 'https://api.line.me/v2/bot/message/push',
    method: 'POST',
    body: data,
    json: true
  }, function (err, res, body) {
    if (err) console.log('error')
    if (res) console.log('success')
    if (body) console.log(body)
  })
}
app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})