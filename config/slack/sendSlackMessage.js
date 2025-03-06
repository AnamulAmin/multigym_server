import axios from "axios";

export async function sendMessageToSlack(channel,text) {
    await axios.post('https://slack.com/api/chat.postMessage', {
        channel,
        text,
    }, {
        headers: {
            'Authorization': 'Bearer ' + process.env.SLACK_BOT_TOKEN
        }
    });
}