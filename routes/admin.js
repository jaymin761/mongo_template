const express = require('express');

const router = express.Router();
const AdminAuthMiddleware = require('../middleware/AdminAuth');


router.post('/login', AdminValidationLogin.login, AdminController.login);

router.prefix('/', (route) => {
    route.use(AdminAuthMiddleware);
});

module.exports = router;