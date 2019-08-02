const axiosSlackSendgrid = require('../../../axios-slack-sendgrid');
const axiosSlackTruemail = require('../../../axios-slack-truemail');
const logger = require('../logger');

module.exports = {
    dispatchSendGridEmailError: (error, emailType) => {
        const payload = {
            text: `${emailType} email delivery has failed`,
            attachments: [
                {
                    fallback: "Investigate undelivered email issue",
                    author_name: "Chokchok",
                    title: "Please investigate cause of delivery failure",
                    text: JSON.stringify(error.response)
                }
            ]
        }
        axiosSlackSendgrid.post('', payload)
        .then((response) => {
            if (response.status === 200) {
                logger.info('dispatchSendGridEmailError request has posted message to Slack channel');
            }
        }).catch((error) => {
            if (error) {
                logger.warn(`dispatchSendGridEmailError request has failed posted message to Slack channel`);
            }
        });
    },
    
    dispatchSendGridOptinError: (error) => {
        const payload = {
            text: `/marketing/contacts call has failed`,
            attachments: [
                {
                    fallback: 'Investigate /marketing/contacts call',
                    author_name: 'Chokchok',
                    title: "Please investigate cause of API failure",
                    text: JSON.stringify(error.response)
                }
            ]
        }
        
        axiosSlackSendgrid.post('', payload)
        .then(response => {
            if (response.status === 200) {
                logger.info('dispatchSendGridOptinError request has processed');
            }
        }).catch(error => {
            if (error) {
                logger.warn(`dispatchSendGridOptinError request has failed to processed`);
            }
        });
    },
    dispatchTruemailRatelimitError: (email) => {
        logger.warn('truemail api rate exceeded');
        const payload = {
            text: "Truemail API credit limit is reached!",
            attachments: [
                {
                    fallback: "Charge your Truemail API credit",
                    author_name: "Chokchok",
                    title: `Please charge more TrueMail API credit | and check this email: ${email}`,
                    text: "visit https://truemail.io/ and sign-in to admin account, buy more credit"
                }
            ]
        }
        axiosSlackTruemail.post('', payload)
        .then(response => {
            if (response.status === 200) {
                logger.info('dispatchTruemailRatelimitError request has posted message to Slack channel');
            }
        }).catch(error => {
            if (error) {
                logger.warn(`dispatchTruemailRatelimitError request has failed to post error message to Slack`);
            }
        });
    },
    dispatchTruemailError: (email) => {
        const payload = {
            text: `Truemail API returned error (checkout)`,
            attachments: [
                {
                    fallback: "Check with Truemail Support",
                    author_name: "Chokchok",
                    title: `Following email: ${email}, is unverified due to TrueMail API error`,
                    text: "Double check if email address is legit, contact TrueMail support for error in API"
                }
            ]
        }
        axiosSlackTrueMail.post('', payload)
        .then(response => {
            if (response.status === 200) {
                logger.info('dispatchTruemailError request has posted message to Slack channel');
            }
        }).catch(error => {
            if (error) {
                logger.warn(`dispatchTruemailError request has failed to post error message to Slack`);
            }
        });
    }
}