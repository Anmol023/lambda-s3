const AWS = require('aws-sdk')
const fileType = require('file-type');

AWS.config.credentials = new AWS.Credentials('AKIA444KKQ73HKMQLJDY', '8hROm37vM6ptUAnABTOpzO8gS10esC0wUv3Cq6bY', null);
AWS.config.region = 'ap-south-1';
const s3 = new AWS.S3({
    region: AWS.config.region,
    credentials: AWS.config.credentials
});
exports.handler = async function(event, context){
    let request = event.body;
    let base64Value = request.DocumentDetails.DocFile;
    let docDetails = [request.DocumentDetails.LeadID, request.DocumentDetails.DocType, request.DocumentDetails.DocKey];   
    let buffer = new Buffer.from(base64Value, 'base64');
    let type = fileType.fromBuffer(buffer);
    console.log(type);
    if (type == null){
        return context.fail("Error in Base64 String");
    }

    let file = getFile(docDetails, buffer);
    let param = file.param

    s3.putObject(param, function(err, data){
        if(err)
            return console.log(err)
        return console.log("Successfully uploaded file")
    })
}

let getFile = function(docDetails, buffer){
    let key = `${docDetails[0]}/${docDetails[2]}${docDetails[1]}`
    let fileFullPath = 'https://doc-managmnt.s3.amazonaws.com/'+ key
    

    let param = {
        Bucket: 'doc-managmnt',
        Key : key,
        Body: buffer
    };

    let uploadedFile = {
        type: docDetails[1],
        name: docDetails[1]+docDetails[2],
        full_path: fileFullPath
    }

    return{
        'param': param,
        'uploadedFile':uploadedFile
    }
}