// var AWS = require('aws-sdk');
import AWS from 'aws-sdk';

var s3 = new AWS.S3({});

export const sts = new AWS.STS({ region: process.env.AWS_REGION });

// sts.assumeRole({
//     ExternalId: process.env.EXTERNAL_ID,
//     RoleArn: process.env.ROLE_ARN,
//     RoleSessionName: process.env.ROLE_SESSION_NAME
// }, (err, data) => {

//     s3 = new AWS.S3({
//         accessKeyId: data.Credentials.AccessKeyId,
//         secretAccessKey: data.Credentials.SecretAccessKey,
//         sessionToken: data.Credentials.SessionToken,
//     });

//     console.log("Was not able to connect AWS ");
//     if (err) throw err;
//     console.log("TOKEN GENERATED",data);
// });

export function renewBucketToken(){
    const sts = new AWS.STS({ region: process.env.AWS_REGION });
    console.log("Was not able to connect AWS ");
    sts.assumeRole({
        ExternalId: process.env.EXTERNAL_ID,
        RoleArn: process.env.ROLE_ARN,
        RoleSessionName: process.env.ROLE_SESSION_NAME
    }, (err, data) => {
    
        s3 = new AWS.S3({
            accessKeyId: data.Credentials.AccessKeyId,
            secretAccessKey: data.Credentials.SecretAccessKey,
            sessionToken: data.Credentials.SessionToken,
        });
    
        
        if (err) throw err;
        console.log("RENEWED TOKEN ",data);
    })

}

export function getRenewedBucketToken(){
    return new Promise((resolve, reject)=>{
        const sts = new AWS.STS({ region: process.env.AWS_REGION });
        console.log("Was not able to connect AWS ");
        sts.assumeRole({
            ExternalId: process.env.EXTERNAL_ID,
            RoleArn: process.env.ROLE_ARN,
            RoleSessionName: process.env.ROLE_SESSION_NAME
        }, (err, data) => {
            console.log("RENEWED TOKEN ",data);
            s3 = new AWS.S3({
                accessKeyId: data.Credentials.AccessKeyId,
                secretAccessKey: data.Credentials.SecretAccessKey,
                sessionToken: data.Credentials.SessionToken,
            });
        
            
            if (err) throw err;

            resolve[data];
        });
    
    });

}


// console.log("S3", s3);


export const uploadPhotoTochat = async ( file, imageName ) => {
    
    let result = 0;
    // config
    console.log('file en el upload' , file);
    console.log('name file' , imageName);
    // const bytesArray =  Buffer.from(file.data, 'base64');
    const bytesArray =  Buffer.from(file.file[0] , 'base64');

    console.log("Bytes array", bytesArray );
    
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: process.env.CHAT_FILES_FOLDER + "/" + imageName,
        Body: bytesArray,
        ContentType: file.type,
        ContentLength: file.size,
    };

    try{
        const res = await s3.putObject(params).promise();
        console.log("Photo Uploaded successfully", res.$response);
        result = 1;
    }
    catch(error){
        console.log("Error", error);
        result = 0
    }
    return result;
}


export const getChatPhotoByTheName = async ( imageName ) =>{

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: process.env.CHAT_FILES_FOLDER + "/" + imageName,
    
    }

    try{
        // const res =  await s3.getObject(params).promise();
        const res =  await s3.getSignedUrl('getObject',params);
        // s3.getSignedUrl('',)
        // const data = Buffer.from(res.Body? res.Body as string: '').toString("base64");
        // console.log('Datos del objeto:', res);
        // console.log('Datos de la data :', data);
        // return 1;
        return {responseStatus: 1, imageUrl: res };
    }
    catch(error){
        console.log("Error didn't get the image",error);
        // return 0;
        return {responseStatus: 0, imageUrl: '' };
    }

}
