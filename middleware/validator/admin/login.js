const validator = require('../../../helper/validate');
const {
    sendValidationError
} = require("../../../controllers/admin/baseController");

const login = async (req, res, next) => {
    const validationRule = {
        "email": "required|email",
        "password": "required|string|min:6",
    }
    try {
        const isValidate = await validator(req.body, validationRule, {}, (erros, status) => {
            if (!status) {
                sendValidationError(res, erros);
            } else {
                next();
            }
        });
    } catch (e) {
    }
}

module.exports = {
    login
}