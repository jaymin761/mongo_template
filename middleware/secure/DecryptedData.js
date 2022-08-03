
const DecryptedDataResponse = (async (req , res , next) => {
    const crypto = require("crypto");
    const decipher =  await crypto.createDecipheriv(process.env.algorithm, process.env.SecuritykeyDec, process.env.initVectorDec);
    let encryptedData;
    if(req.body.value){
        encryptedData = req.body.value;
        let decryptedData = decipher.update(encryptedData, "base64", "utf-8");
        decryptedData += decipher.final("utf8");
        req.body = JSON.parse(decryptedData);
    }
    next();
});

const DecryptedData = (async (req, res, next ) => {
    if (req.headers.env) {
        if (req.headers.env == 'touring') {
            next();
        }else{
            return DecryptedDataResponse(req , res , next );
        }
    }else{
        return DecryptedDataResponse(req , res , next );
    }
    
});

module.exports = {
    DecryptedData,
}


