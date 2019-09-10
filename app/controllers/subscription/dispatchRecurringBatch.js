const logger = require('../../utils/logger');
const open = require('amqplib');
const rabbitMQConnection = require('../../utils/messageQueue/rabbitMQConnector');
const recurringQueue = 'recurring';
const recurringRetryQueue = 'recurring-retry';
const recurringEx = 'recurring';
const recurringRetryEx = 'recurring-retry';
const slackMsgDispatcher = require('../../utils/errorDispatchers/errorDispatchers');

function dispatchRecurringBatch (req, res, next) {

    const attempt = req.body.attempt;
    const orders = req.body.orders;

    console.log(attempt);
    console.log(orders);

    if (!attempt || !orders) {
        logger.error(`dispatchRecurringBatch has failed | bad request - missing parameter`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request- missing parameters'
        });
    }

    if (!Array.isArray(orders)) {
        logger.error(`dispatchRecurringBatch has failed | bad request - invalid data type of orders`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request - invalid data type of orders'
        });
    }

    switch (attempt) {
        case "1" :
            break;
        case "2" :
            break;
        case "3": 
            break;
        case "4":
            break;
        case "5":
            break;
        case "6": 
            break;
        case "7" :
            break;
        default: 
            logger.error(`dispatchRecurringBatch request has failed | unknown attemp id`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown attempt id'
            });
    }

    // if no order in batch return 200 with no_result

    if (orders.length === 0) {

        logger.warn(`dispatchRecurringBatch request has not processed | no subscriptions found`);
        return res.status(200).json({
            status: 'success',
            result: 'No_result',
            message: 'No order to initiate recurring process'
        });
    }

    if (orders.length !== 0) {

        // dispatch message to MQ

        open.connect(rabbitMQConnection())
        .then(connection => {
            connection.createChannel()
            .then(ch => {

                const exchange = ch.assertExchange(recurringEx, 'direct', { durable: true});
                const retryExchange = ch.assertExchange(recurringRetryEx, 'direct', { durable: true });
                const bindQueue = ch.bindQueue(recurringQueue, recurringEx);
                const bindRetryQueue = ch.bindQueue(recurringRetryQueue, recurringRetryEx);

                Promise.all([
                    exchange,
                    retryExchange,
                    bindQueue,
                    bindRetryQueue
                ]).then(() => {

                    const message = {
                        action: 'payment',
                        attempt: attempt,
                        orders: orders
                    }

                    const deliverySchedule =  orders[0].deliverySchedule;

                    ch.publish(recurringEx, '', Buffer.from(JSON.stringify(message)), { persistent: true });
                    ch.close().then(() => {
                        connection.close();

                        slackMsgDispatcher.dispatchRecurringBatchStatus(attempt, deliverySchedule, orders.length);
                        logger.warn(`dispatchRecurringBatch has processed| ${orders.length} orders have been dispatched to recurring process`);
                        return res.status(200).json({
                            status: 'success',
                            attempt: attempt,
                            orders: orders,
                            message: 'orders have batched to recurring process'
                        });
                    }).catch(next);
                });

            });

        }).catch(next);
    }

}

module.exports = dispatchRecurringBatch;