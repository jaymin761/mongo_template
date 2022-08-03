const {
    EncryptedData,
} = require("../../middleware/secure/EncryptedData");

const sendResponse = (async (res, req) => {
    res.status(200).send(req);
});

const sendAuthError = (async (res, req) => {
    res.status(401).send(req.error)
});

const sendError = (async (req, res, error) => {
    res.status(422).send(error);
});
const sendValidationError = (async (res, error) => {
    let transformed = {};
    if (error) {
        Object.keys(error).forEach(function (key, val) {
            transformed[key] = error[key][0];
        });
    }
    res.status(422).send(transformed);
});

const sendApiValidationError = (async (req, res, error) => {
    let transformed = {};
    if (error) {
        Object.keys(error).forEach(function (key, val) {
            transformed[key] = error[key][0];
        });
    }
    res.status(422).send({
        "errors": transformed
    });
});
let emptyData = {
    "docs": [],
    "total": 0,
    "limit": 10,
    "page": 1,
    "pages": 1
}
const sendSuccess = (async (req, res, data) => {
    if (!data.data) {
        data.message = "Oops ,data not found"
        data.data = emptyData;
    }
    let response = await EncryptedData(req, res, data);
    res.status(200).send(response);
});

module.exports = {
    sendResponse,
    sendError,
    sendAuthError,
    sendSuccess,
    sendValidationError,
    sendApiValidationError
}