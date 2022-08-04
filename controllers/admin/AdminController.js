var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const md5 = require('md5');
const log4js = require("log4js");
const logger = log4js.getLogger();
const DeviceToken = require('../../models/deviceToken');
const jwt = require('jsonwebtoken');


const {
    sendSuccess,
    sendError
} = require("./baseController");

const Admin = require('../../models/admin');
function adminTokenFunction() {
    let tokenData = md5(Math.floor(Math.random() * 9000000000) + 1000000000) + md5(new Date(new Date().toUTCString()));
    let token = jwt.sign({
        tokenData
    }, process.env.secret, {
        expiresIn: '24h'
    });
    const dataResponse = {
        token: token,
        tokenData: tokenData,
    }
    return dataResponse;
}
const login = (async (req, res) => {

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {
            email,
            password,
        } = req.body;
        const passwordSend = password;
        let resUnauthorized;
        let adminResult = await Admin.findOne({
            email: email
        });
        if (adminResult) {
            await bcrypt.compare(passwordSend, adminResult.password, (async function (err, result) {
                if (result === true) {

                    var dataTokenFunction = adminTokenFunction();
                    var tokenData = dataTokenFunction.tokenData;
                    var token = dataTokenFunction.token;

                    var adminResultResponse = await Admin.findOne({ email: email });
                    adminResultResponse.token = tokenData;
                    await adminResultResponse.save()

                    var data = {
                        _id: adminResultResponse._id,
                        email: adminResultResponse.email,
                        token: token,
                        name: adminResultResponse.name,
                        createdAt: adminResultResponse.createdAt,
                        updatedAt: adminResultResponse.updatedAt,
                    }

                    const responseData = {
                        'message': "Congratulations you are login",
                        'data': data,
                    };
                    await session.commitTransaction();
                    session.endSession();
                    return sendSuccess(req, res, responseData);
                } else {
                    resUnauthorized = {
                        'message': "Oops, Password does not match",
                    }
                    return sendError(req, res, resUnauthorized);
                }
            }));
        } else {
            resUnauthorized = {
                'message': "Oops ,Email does not exist",
            }
            return sendError(req, res, resUnauthorized);
        }
    } catch (err) {
        message = {
            'message': process.env.APP_ERROR_MESSAGE,
        }
        logger.info("Admin Login");
        logger.info(err);
        await session.abortTransaction();
        session.endSession();
        return sendError(req, res, message);
    }
});
const test = (async (req, res) => {
    return sendSuccess(req, res, {
        'message': 'test success',
        'data': {}
    });

})

module.exports = {
    login,
    test
}