const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
    type: {
        type: Number,
        required: false,
        maxlength: 11,
        comment:'1 = admin 2 = customer 3 = vendor'
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'vendors',
        required: false,
        maxlength: 100,
        comment:'foreign key vendors table'
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'customers',
        required: false,
        maxlength: 100,
        comment:'foreign key customer table'
    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'admins',
        required: false,
        maxlength: 11,
        comment:'foreign key admins table'
    },
    device_token: {
        type: 'string',
        required: false,
        maxlength: 255,
        comment:'Auto generate Fully Dynamic Token'
    },
    fcm_device_token: {
        type: 'string',
        required: false,
        maxlength: 255,
        comment:'generate in fcm fcm_device_token'
    },
    token: {
        type: 'string',
        required: false,
        maxlength: 255,
        comment:'For Pass authorization '
    },
    firebase_token: {
        type: 'string',
        required: false,
        comment:'For Pass firebase token'
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("device_tokens", dataSchema);