const https = require("https")
const express = require("express")
const line = require('@line/bot-sdk')
const dotenv= require('dotenv')

const env = dotenv.config().parsed
const lineConfig = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN
}
//create client
const client = new line.Client(lineConfig)

const app = express()
const PORT = process.env.PORT || 3000 //

app.post("/webhook", line.middleware(lineConfig), async (req, res) => {
    // content = request.get_json()
    // alert_title = content['alert_title']
    // alert_query = content['alert_query']
    // event_title = content['event_title']
    // alert_type = content['alert_type']
    // priority = content['priority']
    // link = content['link']
    // image = content['snapshot']
    // tags = content['tags']
    try{
      const events = req.body.events
      console.log('event=>>>>', events)
      return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send("OK")
    }catch(error){
      res.status(500).end()
    }
})

const handleEvent = async (event) =>{
  console.log(event)
  return client.replyMessage(event.replyToken,{type:'text',text:'Test'})
}

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
