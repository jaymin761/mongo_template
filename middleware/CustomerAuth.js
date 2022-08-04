const jwt = require('jsonwebtoken');
const {
    sendAuthError
} = require("../controllers/customer/baseController");
const DeviceToken = require('../models/deviceToken');

module.exports = function (req, res, next) {
    let token = req.headers['access_token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    const isRefreshToken = req.headers['isrefreshtoken'];
    let resUnauthorized = {
        'message': "Unauthorized access!",
        "error": { 'Unauthorized': 'You are not login, You have to login first' }
    }
    
    if (token === undefined) {
        return sendAuthError(res, resUnauthorized);
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        
    }
    if (token) {
        jwt.verify(token, process.env.secret, async (err, decoded) => {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    if (isRefreshToken) {
                        jwt.verify(token, process.env.secret, { ignoreExpiration: true }, async (err, decodede) => {
                            if(req.body.user_type == 1 || req.query.user_type == 1){
                                const vendorInfo = await DeviceToken.findOne({ token: decodede.tokenData });
                                if (vendorInfo) {
                                    req.decoded = vendorInfo;
                                    next();
                                } else {
                                    return sendAuthError(res, resUnauthorized);
                                }
                            }else {
                                const customerInfo = await DeviceToken.findOne({ token: decodede.tokenData });
                                if (customerInfo) {
                                    req.decoded = customerInfo;
                                    next();
                                } else {
                                    return sendAuthError(res, resUnauthorized);
                                }
                            }
                            
                        });
                    } else {
                        resUnauthorized = {
                            'message': "Unauthorized access!",
                            "error": {
                                'Unauthorized': 'Unauthorized access',
                                "isExpired": 1
                            }
                        }
                        return sendAuthError(res, resUnauthorized);
                    }
                } else {
                    return sendAuthError(res, resUnauthorized);
                }
            } else {
                if(req.body.user_type == 1 || req.query.user_type == 1){
                    const vendorInfo = await DeviceToken.findOne({ token: decoded.tokenData });
                    if (vendorInfo === null) {
                        return sendAuthError(res, resUnauthorized);
                    } else {
                        if (isRefreshToken) {
                            resUnauthorized = {
                                'message': "Unauthorized access!",
                                "error": { 'token': 'Your current token is not expired.' }
                            }
                            return sendAuthError(res, resUnauthorized);
                        }
                        if (vendorInfo.vendor_id) {
                            req.decoded = vendorInfo;
                            next();
                        } else {
                            return sendAuthError(res, resUnauthorized);
                        }
                    }
                }else{
                    const customerInfo = await DeviceToken.findOne({ token: decoded.tokenData });
                    if (customerInfo === null) {
                        return sendAuthError(res, resUnauthorized);
                    } else {
                        if (isRefreshToken) {
                            resUnauthorized = {
                                'message': "Unauthorized access!",
                                "error": { 'token': 'Your current token is not expired.' }
                            }
                            return sendAuthError(res, resUnauthorized);
                        }
                        if (customerInfo.customer_id) {
                            req.decoded = customerInfo;
                            next();
                        } else {
                            return sendAuthError(res, resUnauthorized);
                        }
                    }
                } 
            }
        });
    } else {
        return sendAuthError(res, resUnauthorized);
    }
};