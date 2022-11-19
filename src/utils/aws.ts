import aws from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 1. Creates a new instance of the S3 Bucket
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    });

    // 2. Updates the main configuration class with the region, credentials, and additional request options
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
      signatureVersion: "v4",
    });

    // 3. Generates a presigned URL allowing you to write to the S3 Bucket
    const post = await s3.createPresignedPost({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Fields: {
        key: req.query.file,
      },
      Expires: 60, // seconds
      Conditions: [
        ["content-length-range", 0, 5048576], // up to 1 MB
      ],
    });

    // 4. Return the presigned URL that will be used for file upload
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
}
