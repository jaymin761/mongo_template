
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
    const session = await Admin.startSession();
    try {
        session.startTransaction();
        const {
            email,
            password,
            fcm_device_token
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

                    let deviceTokenData = new DeviceToken({});
                    deviceTokenData.admin_id = adminResult._id,
                    deviceTokenData.type = 1,
                    deviceTokenData.token = tokenData,
                    deviceTokenData.device_token = token,
                    deviceTokenData.fcm_device_token = fcm_device_token,
                    await deviceTokenData.save();
                    

                    let adminResultResponse = await Admin.findOne({ email: email });

                  
                    adminResultResponse['access_token'] = token;
                    const dataPass = {
                        'data': data,
                    }
                    const responseData = {
                        'message': "Congratulations you are login",
                        'data': dataPass,
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

module.exports = {
    login,
}