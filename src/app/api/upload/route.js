import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";

function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, "");
}

export async function POST(req) {
    const formData = await req.formData();
    const file = formData.get('file');
    const { name, type } = file;
    const data = await file.arrayBuffer();

    const s3client = new S3Client({
        region: process.env.MY_AWS_REGION,
        credentials: {
            accessKeyId: process.env.MY_AWS_ACCESS_KEY,
            secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
        },
    });

    const newid = uniqid();
    const parts = name.split('.');
    const ext = parts.pop();
    const baseName = sanitizeFilename(parts.join('.'));
    const id = baseName + '_' + newid;
    const newName = id + '.' + ext;

    const uploadCommand = new PutObjectCommand({
        Bucket: process.env.MY_BUCKET_NAME,
        Body: data,
        ACL: 'public-read',
        ContentType: type,
        Key: newName
    });

    await s3client.send(uploadCommand);

    return Response.json({ name, ext, newName, id });
}
