const express = require('express');

const router = express.Router();
const AdminAuthMiddleware = require('../middleware/AdminAuth');


//controller
const AdminController = require('../controllers/admin/AdminController');

const AdminValidationLogin = require('../middleware/validator/admin/login');

router.post('/login', AdminValidationLogin.login, AdminController.login);

router.prefix('/', (route) => {
    route.use(AdminAuthMiddleware);
});

module.exports = router;