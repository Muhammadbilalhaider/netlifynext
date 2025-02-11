// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';


// const s3Client = new S3Client({
//     forcePathStyle: false,
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
// });


export const uploadToS3 = async function uploadToS3(file:any) {
    // try {     

    //     const key =`${Date.now()}-${file.originalname}`;

    //     const uploadParams: any = {
    //         Bucket: process.env.AWS_BUCKET_NAME,
    //         Key: key,
    //         Body: file.buffer,
    //         ACL: 'public-read',
    //         ContentType: file.mimetype,
    //     };

    //     const uploadCommand = new PutObjectCommand(uploadParams);

    //     // Upload to S3
    //     await s3Client.send(uploadCommand);

    //     const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
        
    //     return s3Url
        
    // } catch (error) {
    //     console.log("error while uploading file to s3", error);

    // }
}