const Subscription = require('../../models/Subscription');
const SubcriptionBox = require('../../models/SubscriptionBox');
const logger = require('../../utils/logger');

function updatePackage (req, res, next) {

    const boxType = req.body.boxType;

    if (!boxType) {
        logger.warn(`updatePackage request has failed - bad request`);
        return res.status(400).json({
            status: 'failed',
            message: 'bad request'
        });
    }
   
    if (req.user) {

        Subscription.findOne({ user: req.user._id })
        .then((subscription) => {

            if (!subscription) {
                logger.warn(`updatePackage request has failed | no subscription found | ${req.user._id}`);
                return res.status(422).json({
                    status: 'failed',
                    message: 'no subscription'
                });
            }

            if (subscription) {
                
                SubcriptionBox.findOne({ boxType: boxType })
                .then((box) => {

                    if (!box) {
                        logger.warn(`updatePackage request has failed | no SubcriptionBox found | ${subscription.subscriptionId}`);
                        return res.status(422).json({
                            status: 'failed',
                            message: 'invalid param: boxType'
                        });
                    }

                    if (box) {
                        subscription.subscribedItems[0].itemId = box.id;
                        subscription.lastModified = Date.now();
                        subscription.markModified('subscribedItems');
                        subscription.markModified('lastModified');
                        subscription.save();
                        logger.info(`updatePacage request has processed, package updated | ${subscription.subscriptionId}`);
                        return res.status(200).json({
                            status: 'success',
                            message: 'new package has updated'
                        });
                    }

                }).catch(next);
                
            }
        }).catch(next);
    }
    
}

module.exports = updatePackage;