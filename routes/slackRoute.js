// Imports
import { Router } from 'express';
import axios from 'axios';

const slackRoute = Router();

slackRoute.route('/').get(async (req, res) => {
    try {
        // const response = await axios.post('https://hooks.slack.com/services/T05PRDC6PUL/B05PL32PQQM/LjJsl5bkts5GL1C5m5813TF', {
        const response = await axios.post(process.env.SLACK_WEBHOOK, {
            // text: '**bold** pathaite parsi',
            // text: '<https://google.com|this is a link>',
            // attachments: [
            //     {
            //         "fallback": "Required plain-text summary of the attachment.",
            //         "text": "Optional text that appears within the attachment",
            //         "image_url": "https://anthill.sgp1.cdn.digitaloceanspaces.com/successStory/1688375378561-3.jpg",
            //         "thumb_url": "https://anthill.sgp1.cdn.digitaloceanspaces.com/successStory/1688375378561-3.jpg"
            //     }
            // ],

            // blocks: [
            //     {
            //         "type": "section",
            //         "text": {
            //             "type": "mrkdwn",
            //             "text": "You have a new request:\n*<https://theantopolis.com|Fred Enriquez - New device request>*"
            //         }
            //     },
            //     {
            //         "type": "section",
            //         "fields": [
            //             {
            //                 "type": "mrkdwn",
            //                 "text": "*Type:*\nComputer (laptop)"
            //             },
            //             {
            //                 "type": "mrkdwn",
            //                 "text": "*When:*\nSubmitted Aut 10"
            //             },
            //             {
            //                 "type": "mrkdwn",
            //                 "text": "*Last Update:*\nMar 10, 2015 (3 years, 5 months)"
            //             },
            //             {
            //                 "type": "mrkdwn",
            //                 "text": "*Reason:*\nAll vowel keys aren't working."
            //             },
            //             {
            //                 "type": "mrkdwn",
            //                 "text": "*Specs:*\n\"Cheetah Pro 15\" - Fast, really fast\""
            //             }
            //         ]
            //     },
            //     {
            //         "type": "actions",
            //         "elements": [
            //             {
            //                 "type": "button",
            //                 "text": {
            //                     "type": "plain_text",
            //                     "emoji": true,
            //                     "text": "Approve"
            //                 },
            //                 "style": "primary",
            //                 "value": "click_me_123"
            //             },
            //             {
            //                 "type": "button",
            //                 "text": {
            //                     "type": "plain_text",
            //                     "emoji": true,
            //                     "text": "Deny"
            //                 },
            //                 "style": "danger",
            //                 "value": "click_me_123"
            //             }
            //         ]
            //     }
            // ]
            // text: {
            //     type: "mrkdwn",
            //     text: "*Bold* Not Bold"
            // }

        });
        res.send('Slack notification sent:' + response.data);
    } catch (error) {
        res.send('Slack notification sent:' + error);
    }
    // const response = await axios.post(process.env.SLACK_WEBHOOK, {
    //     text: 'pathaite parsi'
    // });
    // res.send('Slack notification sent:', response.data);
    // res.send('Slack notification sent:');
});

slackRoute.route('/createChannel').post(async (req, res) => {
    try {
        const response = await axios.post('https://slack.com/api/conversations.create', {
            name: req.body.channel,
            is_private: true
        }, {
            headers: {
                'Authorization': 'Bearer ' + process.env.SLACK_TOKEN
            }
        });
        res.send('Slack notification sent:' + JSON.stringify(response.data));
    } catch (error) {
        res.send('Slack notification sent:' + JSON.stringify(error));
    }
})

slackRoute.route('/sendMessage').post(async (req, res) => {

    const {channel, text} = req.body;

    try {
        const response = await axios.post('https://slack.com/api/chat.postMessage', {
            channel,
            text,
        }, {
            headers: {
                'Authorization': 'Bearer ' + process.env.SLACK_BOT_TOKEN
            }
        });
        res.send('Slack notification sent:' + JSON.stringify(response.data));
    } catch (error) {
        res.send('Slack notification sent:' + JSON.stringify(error));
    }
})

slackRoute.route('/viewUsers').get(async (req, res) => {
    try {
        const response = await axios.get('https://slack.com/api/users.list', {
            headers: {
                'Authorization': 'Bearer ' + process.env.SLACK_BOT_TOKEN
            }
        });
        res.send(JSON.stringify(response.data.members));
    } catch (error) {
        res.send('Slack notification sent:' + JSON.stringify(error));
    }
})


// Export
export default slackRoute;