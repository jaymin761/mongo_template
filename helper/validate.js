const Validator = require('validatorjs');
const mongoose = require('mongoose');
const Models = require("../models");
const validator = (body, rules, customMessages, callback) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors.errors, false));
};


Validator.registerAsync('exist_value_with_type', function (value, attribute, req, passes) {
    
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');

    let attArr = attribute.split(",");
    if (attArr.length !== 4) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: _id, 3: usertype } = attArr;

    let msg = (column == "email") ? `${column} has already been taken ` : `${column} already in use`
   
    mongoose.model(table).findOne({ [column]: value, user_type: usertype ,_id:{$ne: _id }}).then((result) => {
        if (result) {
            passes(false, msg);
        } else {
            passes(); 
        }
    }).catch((err) => {
        passes(false, err);
    });
});

Validator.registerAsync('exist_with_type', function (value, attribute, req, passes) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column,usertype');

    let attArr = attribute.split(",");

    if (attArr.length !== 3) throw new Error(`Invalid format for validation rule on ${attribute}`);
    const { 0: table, 1: column, 2: usertype } = attArr;
    
    let msg = (column == "email") ? `${column} has already been taken ` : `${column.replace('_', ' ')} already in use`;    

    mongoose.model(table).findOne({ [column]: value, user_type: usertype }).then((result) => {
        if (result) {
            passes(false, msg);
        } else {
            passes();
        }
    }).catch((err) => {
        passes(false, err);
    });
});



Validator.registerAsync('exist', function (value, attribute, req, passes) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    //split table and column
    let attArr = attribute.split(",");
    if (attArr.length !== 2 && attArr.length !== 3) throw new Error(`Invalid format for validation rule on ${attribute}`);

    const { 0: table, 1: column, 2: id } = attArr;

    var query = {};
    // let msg = (column == "company_code") ? `${column} has already been taken `: `${column} already in use`;
    let msg = `${column.replace(/[_]/g, " ")} has already exist`;

    query[column] = value;
    if (id !== undefined && id != 0)
        query['_id'] = { '$ne': id };

    if (value === undefined || value === "") {
        passes();
    } else {
        Models.models[table].findOne(query)
            .then((result) => {
                if (result) {
                    passes(false, msg); // return false if value exists
                    return;
                }
                passes();
            });
    }
});

Validator.registerAsync('fullVerified', function (value, attribute, req, passes) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    //split table and column
    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);

    //assign array index 0 and 1 to table and column respectively
    const { 0: table, 1: col1 } = attArr;
    //define custom error message
    let msg = `User is not verified, please verify phone and email.`
    //check if incoming value already exists in the database
    var query = {};
    query["id"] = parseInt(value);
    query["is_phone_verified"] = 1
    query["is_email_verified"] = 1
    query["kyc_status"] = 1

    User.findOne({ where: query, attributes: ["id"] })
        .then((result) => {
            if (!result) {
                passes(false, msg); // return false if value exists
                return;
            }
            passes();
        })
});
Validator.registerAsync('verified', function (value, attribute, req, passes) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: exist:table,column');
    //split table and column
    let attArr = attribute.split(",");
    if (attArr.length !== 2) throw new Error(`Invalid format for validation rule on ${attribute}`);

    //assign array index 0 and 1 to table and column respectively
    const { 0: table, 1: col1 } = attArr;
    //define custom error message
    let msg = `User is not verified, please verify phone and email.`
    //check if incoming value already exists in the database
    var query = {};
    query["phone_no"] = value;
    query["is_phone_verified"] = 1
    query["is_email_verified"] = 1

    User.findOne({ where: query, attributes: ["id"] })
        .then((result) => {
            if (!result) {
                passes(false, msg); // return false if value exists
                return;
            }
            passes();
        })
});

Validator.registerAsync('cityExist', function (value, attribute, req, passes) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: cityExist:table,column');
    //split table and column
    let attArr = attribute.split(",");
    const { 0: table, 1: column, 2: countryCode, 3: stateCode, 4: id } = attArr;
    var query = {};
    let msg = `${column} has already exist`;
    query[column] = value;
    query["country_code"] = countryCode;
    query["state_code"] = stateCode;

    if (id !== undefined && id != 0)
        query['_id'] = { '$ne': id };

    if (value === undefined || value === "" || countryCode == 0 || stateCode == 0) {
        passes();
    } else {
        Models.models[table].findOne(query)
            .then((result) => {
                if (result) {
                    passes(false, msg); // return false if value exists
                    return;
                }
                passes();
            });
    }
});

Validator.registerAsync('stateExist', function (value, attribute, req, passes) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: stateExist:table,column');
    //split table and column
    let attArr = attribute.split(",");
    const { 0: table, 1: column, 2: countryCode, 3: id } = attArr;
    var query = {};
    let msg = `${column} has already exist`;
    query[column] = value;
    query["country_code"] = countryCode;

    if (id !== undefined && id != 0)
        query['_id'] = { '$ne': id };

    if (value === undefined || value === "" || countryCode == 0) {
        passes();
    } else {
        Models.models[table].findOne(query)
            .then((result) => {
                if (result) {
                    passes(false, msg); // return false if value exists
                    return;
                }
                passes();
            });
    }
});

Validator.registerAsync('vehicleModelExist', function (value, attribute, req, passes) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: vehicleModelExist:table,column');
    //split table and column
    let attArr = attribute.split(",");
    const { 0: table, 1: column, 2: brand_id, 3: id } = attArr;
    var query = {};
    let msg = `${column} has already exist`;
    query[column] = value;
    query["brand_id"] = brand_id;

    if (id !== undefined && id != 0)
        query['_id'] = { '$ne': id };

    if (value === undefined || value === "" || brand_id == 0) {
        passes();
    } else {
        Models.models[table].findOne(query)
            .then((result) => {
                if (result) {
                    passes(false, msg); // return false if value exists
                    return;
                }
                passes();
            });
    }
});

Validator.registerAsync('vehicleVariantExist', function (value, attribute, req, passes) {
    if (!attribute) throw new Error('Specify Requirements i.e fieldName: vehicleVariantExist:table,column');
    //split table and column
    let attArr = attribute.split(",");
    const { 0: table, 1: column, 2: brand_id, 3: model_id, 4: id } = attArr;
    var query = {};
    let msg = `${column} has already exist`;
    query[column] = value;
    query["brand_id"] = brand_id;
    query["model_id"] = model_id;

    if (id !== undefined && id != 0)
        query['_id'] = { '$ne': id };

    if (value === undefined || value === "" || brand_id == 0 || model_id == 0) {
        passes();
    } else {
        Models.models[table].findOne(query)
            .then((result) => {
                if (result) {
                    passes(false, msg); // return false if value exists
                    return;
                }
                passes();
            });
    }
});

module.exports = validator;