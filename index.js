const https = require("https");
const express = require("express");
const line = require("@line/bot-sdk");
require("dotenv").config();
const axios = require("axios");

const lineConfig = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_TOKEN,
};

const client = new line.Client(lineConfig);

const app = express();
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000; //

app.post("/webhook", async (req, res) => {
  try {
    const events = req.body.events;
    console.log("event=>>>>", events);
    return events.length > 0
      ? await events.map((item) => handleEvent(item))
      : res.status(200).send("OK");
  } catch (error) {
    res.status(500).end();
  }
});

app.post("/alert", async (req, res) => {
  const {
    alert_title,
    event_title,
    priority,
    link,
    tags,
  } = req.body;
  console.log(req.body)

  message = mm_set(
    event_title,
    alert_title,
    tags,
    priority,
    link,
  );

  // $ curl -X POST -H 'Authorization: Bearer <access_token>' -F 'message=foobar' \
  // https://notify-api.line.me/api/notify
  // {"status":200,"message":"ok"}

  try {
    const response = await axios.post(
      "https://notify-api.line.me/api/notify",
      {
        header: {
          'Content-Type': 'multipart/form-data',
        },
        auth: {
          bearer: process.env.TOKEN,
        },
        form: {
          message: [message]
        },
      })
}catch (error) {
  console.log("message sent unsuccessful");
  console.log(error.response.data.details);
  res.status(500).end();
}

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

try {
  const response = await axios.post(
    "https://api.line.me/v2/bot/message/multicast",
    {
      to: [
        "Ubedd0f50b99217db43961d4fded59241", "Ue7ab5379916d0c72b062ecc87f41a3da",
      ],
      messages: [message],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lineConfig.channelAccessToken}`,
      },
    }
  );
  // console.log(response.body);
  // console.log(response.data);
  console.log("message sent");
  res.status(200).end();
} catch (error) {
  console.log("message sent unsuccessful");
  console.log(error.response.data.details);
  res.status(500).end();
}});

function mm_set(
  event_title,
  alert_title,
  tags,
  priority,
  link,
) {
  console.log(
    event_title,
    alert_title,
    tags,
    priority,
    link,
  );
  return (message = {
    type: "flex",
    altText: "Alert",
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: "https://www.drupal.org/files/datadog-logo-purple.png",
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "Datadog Monitor",
            weight: "bold",
            size: "xl",
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Event",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: event_title,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5,
                  },
                ],
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Alert title",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: alert_title,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5,
                  },
                ],
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Tags",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: tags,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5,
                  },
                ],
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Priority",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: priority,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5,
                  },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "link",
            height: "sm",
            action: {
              type: "uri",
              label: "WEBSITE",
              uri: link,
            },
          },
          {
            type: "box",
            layout: "vertical",
            contents: [],
            margin: "sm",
          },
        ],
        flex: 0,
      },
    },
  });
}

const handleEvent = async (event) => {
  console.log(event);
  return client.replyMessage(event.replyToken, { type: "text", text: "Hello" });
};

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});