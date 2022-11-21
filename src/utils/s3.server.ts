import aws from "aws-sdk";
import cuid from "cuid";
// import S3 from "aws-sdk/client/s3";

export default async function uploadPresignedPost(fileExtension: string) {
  try {
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });

    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: "v4",
    });

    //   const data = await s3
    //     .upload({
    //       Bucket: process.env.AWS_S3_BUCKET_NAME || "",
    //       Key: `${cuid()}.${file.name.split(".").at(-1)}`,
    //       Body: file,
    //     })
    //     .promise();

    //   return data.Location;
    //--------------------------------------------------------------------------------------
    // const fileParams = {
    //   Bucket: process.env.AWS_S3_BUCKET_NAME,
    //   Key: `${cuid()}.${fileExtension}`,
    //   Expires: 600,
    //   ACL: "public-read",
    // };

    // console.log("fileParams", fileParams);

    // const url = await s3.getSignedUrl("putObject", fileParams);

    const preSignedPost = await s3.createPresignedPost({
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Fields: {
        key: `${cuid()}.${fileExtension}`,
      },
      Expires: 60, // seconds
      Conditions: [
        ["content-length-range", 0, 5048576], // up to 1 MB
      ],
    });

    return preSignedPost;
  } catch (error) {
    console.log(error);
  }
}
