const jwt = require('jsonwebtoken');
const admin = require('../models/admin')


const {
    sendAuthError
} = require("../controllers/admin/baseController");

module.exports = function (req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['Authorization']; // Express headers are auto converted to lowercase
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
                console.log(err);
                if (err.name == "TokenExpiredError") {
                    if (isRefreshToken) {
                        const payload = jwt.verify(token, process.env.secret, { ignoreExpiration: true }, async (err, decodede) => {
                            const userInfo = await admin.findOne({
                                where: { token: decodede.tokenData }
                            });
                            // console.log(decodede.tokendata)
                            if (userInfo) {
                                req.decoded = userInfo
                                next();
                            } else {
                                return sendAuthError(res, resUnauthorized);
                            }
                            // console.log("user:" +userInfo.id);
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


                // return createErrorResponse(req, res, 'Unauthorized Access!', { 'message': 'Unauthorized Access!' }, 401);
            } else {
                const userInfo = await admin.findOne({
                    token: decoded.tokenData
                });

                if (userInfo === null) {
                    return sendAuthError(res, resUnauthorized);
                } else {
                    req.decoded = userInfo;
                    next();
                }
            }
        });
    } else {
        return sendAuthError(res, resUnauthorized);

    }
};