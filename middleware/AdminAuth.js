const jwt = require('jsonwebtoken');
const {
    sendAuthError
} = require("../controllers/admin/baseController");
const DeviceToken = require('../models/deviceToken');

module.exports = function (req, res, next) {
    let token = req.headers['access_token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    const isRefreshToken = req.headers['isrefreshtoken'];
    let resUnauthorized = {
        'message': "Unauthorized Access!",
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
                            const AdminInfo = await DeviceToken.findOne({ token: decodede.tokenData });
                            if (AdminInfo) {
                                req.decoded = AdminInfo;
                                next();
                            } else {
                                return sendAuthError(res, resUnauthorized);
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
                const AdminInfo = await DeviceToken.findOne({ token: decoded.tokenData });
                if (AdminInfo === null) {
                    return sendAuthError(res, resUnauthorized);
                } else {
                    if (isRefreshToken) {
                        resUnauthorized = {
                            'message': "Unauthorized access!",
                            "error": { 'token': 'Your current token is not expired.' }
                        }
                        return sendAuthError(res, resUnauthorized);
                    }
                    if (AdminInfo.admin_id) {
                        req.decoded = AdminInfo;
                        next();
                    } else {
                        return sendAuthError(res, resUnauthorized);
                    }
                }
            }
        });
    } else {
        return sendAuthError(res, resUnauthorized);
    }
};