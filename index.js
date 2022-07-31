const https = require("https")
const express = require("express")
const line = require('@line/bot-sdk')
const dotenv= require('dotenv')
const axios = require('axios')

const env = dotenv.config().parsed
const lineConfig = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN
}
//create client
const client = new line.Client(lineConfig)

const app = express()
app.use(require('body-parser').urlencoded({ extended: false }));
const PORT = process.env.PORT || 3000 //

lineID_sent_to = ["111", "222"]

app.post("/webhook", line.middleware(lineConfig), async (req, res) => {
    try{
      const events = req.body.events
      console.log('event=>>>>', events)
      return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send("OK")
    }catch(error){
      res.status(500).end()
    }
})

app.post("/alert", async (req, res) => {
    // content = request.get_json()
    // alert_title = content['alert_title']
    // alert_query = content['alert_query']
    // event_title = content['event_title']
    // alert_type = content['alert_type']
    // priority = content['priority']
    // link = content['link']
    // image = content['snapshot']
    // tags = content['tags']

    // console.log(req.body)
    
    const { alert_title, alert_query, event_title, alert_type, priority, link, snapshot, tags } = req.body

    strUrl = "https://api.line.me/v2/bot/message/push"
    // curl -v -X POST https://api.line.me/v2/bot/message/multicast \
    // -H 'Content-Type: application/json' \
    // -H 'Authorization: Bearer {channel access token}' \
    // -d '{
    //     "to": ["U4af4980629...","U0c229f96c4..."],
    //     "messages":[
    //         {
    //             "type":"text",
    //             "text":"Hello, world1"
    //         },
    //         {
    //             "type":"text",
    //             "text":"Hello, world2"
    //         }
    //     ]
    // }'

    message = mm_set(event_title, alert_title, alert_type, tags, priority, link, snapshot)
    console.log(message)
    try {
      const response = await axios.post("https://api.line.me/v2/bot/message/multicast", 
      { 
        "to": ["Ubedd0f50b99217db43961d4fded59241"],
        "messages": message
      }, 
      {
        headers: {
          // 'application/json' is the modern content-type for JSON, but some
          // older servers may use 'text/json'.
          // See: http://bit.ly/text-json
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lineConfig.channelAccessToken}`
        }
    }
    );
    // console.log(response.body);
    console.log(response.data);
    res.sendStatus(200)
  }
  catch(error) {
    res.status(500).end()
  }
    
})

function mm_set(event_title, alert_title, alert_type, tags, priority, link, snapshot) {
  return message = {
    "type": "bubble",
    "hero": {
      "type": "image",
      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
      "size": "full",
      "aspectRatio": "20:13",
      "aspectMode": "cover",
      "action": {
        "type": "uri",
        "uri": snapshot
      }
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "Datadog Monitor",
          "weight": "bold",
          "size": "xl"
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "lg",
          "spacing": "sm",
          "contents": [
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "Event",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 1
                },
                {
                  "type": "text",
                  "text": event_title,
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5
                }
              ]
            },
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "Alert title",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 1
                },
                {
                  "type": "text",
                  "text": alert_title,
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5
                }
              ]
            },
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "Alert type",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 1
                },
                {
                  "type": "text",
                  "text": alert_type,
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5
                }
              ]
            },
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "Tags",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 1
                },
                {
                  "type": "text",
                  "text": tags,
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5
                }
              ]
            },
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "Priority",
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 1
                },
                {
                  "type": "text",
                  "text": priority,
                  "wrap": true,
                  "color": "#666666",
                  "size": "sm",
                  "flex": 5
                }
              ]
            }
          ]
        }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "vertical",
      "spacing": "sm",
      "contents": [
        {
          "type": "button",
          "style": "link",
          "height": "sm",
          "action": {
            "type": "uri",
            "label": "WEBSITE",
            "uri": link
          }
        },
        {
          "type": "box",
          "layout": "vertical",
          "contents": [],
          "margin": "sm"
        }
      ],
      "flex": 0
    }
  }
}

const handleEvent = async (event) =>{
  console.log(event)
  return client.replyMessage(event.replyToken,{type:'text',text:'Test'})
}

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
