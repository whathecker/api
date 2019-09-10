const Subscription = require('../../models/Subscription');
const Order = require('../../models/Order');
const logger = require('../../utils/logger');
const async = require('async');
const slackMsgDispatcher =  require('../../utils/errorDispatchers/errorDispatchers');

function fetchRecurringBatch (req, res, next) {
    
    const attempt = req.params.attempt;
    const currentDate = Date.now();
    console.log(attempt);
    console.log(currentDate);
    const dayInMsec = 86400000;
    let interval;
    
    switch (attempt) {
        case "1" :
            interval = 7 * dayInMsec;
            break;
        case "2" :
            interval = 6 * dayInMsec;
            break;
        case "3": 
            interval = 5 * dayInMsec;
            break;
        case "4":
            interval = 4 * dayInMsec;
            break;
        case "5":
            interval = 3 * dayInMsec;
            break;
        case "6": 
            interval = 2 * dayInMsec;
            break;
        case "7" :
            interval = 1 * dayInMsec;
            break;
        default: 
            logger.error(`fetchRecurringBatch request has failed | unknown attemp id`);
            return res.status(422).json({
                status: 'failed',
                message: 'unknown attempt id'
            });
    }

    // create the due-orders to bill by adding interval and current date:
    const deliverySchedule = new Date(currentDate + interval);
    const deliveryMonth = deliverySchedule.getMonth();
    const deliveryYear = deliverySchedule.getFullYear();
    const deliveryDate = deliverySchedule.getDate();
    
    logger.info(`fetchRecurringBatch | target delivery schedule: ${deliverySchedule}`);
    logger.info(`fetchRecurringBatch | target delivery date: ${deliveryDate}`);
    logger.info(`fetchRecurringBatch | target delivery month: ${deliveryMonth}`);
    logger.info(`fetchRecurringBatch | target delivery year: ${deliveryYear}`);

    Subscription.find({
        isActive: true
        /*
        'nextDeliverySchedule.year': deliveryYear,
        'nextDeliverySchedule.month': deliveryMonth,
        'nextDeliverySchedule.date': deliveryDate,
        isActive: true */
    })
    .then(subscriptions => {

        console.log(subscriptions);

        logger.info(`fetchRecurringBatch | retrieved ${subscriptions.length} subscriptions`);
    
        if (subscriptions.length === 0) {

            slackMsgDispatcher.dispatchRecurringBatchStatus(attempt, deliverySchedule, subscriptions.length);
            logger.warn(`fetchRecurringBatch request has failed | no subscriptions found`);
            return res.status(200).json({
                status: 'success',
                result: 'No_result',
                message: 'No subscrption to initiate recurring process'
            });
        }
        if (subscriptions.length !== 0) {
            
            
            let orderBatch = [];

            async.each(subscriptions, (subscription, callback) => {
                
                const orderNumber = subscription.deliverySchedules[0].orderNumber;
                if (!subscription.isActive) {
                    // skip inactive subscription from recurring process
                    callback();
                }

                if (subscription.isActive) {
                    Order.findOne({ orderNumber: orderNumber })
                    .populate('user', 'userId')
                    .then(order => {
                        if (order) {
                            const orderStatus = order.orderStatus.status;
    
                            // orders are batched only when status is either RECEIVED or OVERDUE
                            if (orderStatus === "RECEIVED" || orderStatus === "OVERDUE") {
                                const orderToProcess = {
                                    subscriptionId: subscription.subscriptionId,
                                    isActive: subscription.isActive,
                                    deliverySchedule: subscription.deliverySchedules[0].nextDeliveryDate,
                                    deliveryFrequency: subscription.deliveryFrequency,
                                    deliveryDay: subscription.deliveryDay,
                                    paymentStatus: order.paymentStatus.status,
                                    orderStatus: order.orderStatus.status,
                                    orderNumber: order.orderNumber,
                                    paymentMethod: order.paymentMethod, /** payment method detail */
                                    orderAmountPerItem: order.orderAmountPerItem,
                                    orderAmount: order.orderAmount,
                                    userId: order.user.userId /** stripe customer_id */
                                }
                                //console.log(orderToProcess);
                                orderBatch.push(orderToProcess);
                            }       
                        }
                        callback();
                    })
                    .catch(error => {
                        error? next(error) : null;
                    });
                }
                          
            }, (error) => {
                if (error) {
                    next(error);
                }

                //slackMsgDispatcher.dispatchRecurringBatchStatus(attempt, deliverySchedule, subscriptions.length);
                logger.info(`fetchRecurringBatch has processed| ${orderBatch.length} orders have been returned`);
                return res.status(200).json({
                    status: 'success',
                    attempt: req.params.attempt,
                    orders: orderBatch,
                    message: 'orders have batched to recurring process'
                });
                
            });
        
        }
    })
    .catch(next);
    
    
    
}

module.exports = fetchRecurringBatch;