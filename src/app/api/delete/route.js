import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3client = new S3Client({
    region: process.env.MY_AWS_REGION,
    credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
    },
});

function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, "");
}

export async function DELETE(req) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.searchParams);
        let filename = searchParams.get('filename');

        if (!filename) {
            return Response.json({ error: "Filename is required" }, { status: 400 });
        }

        filename = sanitizeFilename(filename);

        // Delete video file
        await s3client.send(new DeleteObjectCommand({
            Bucket: process.env.MY_BUCKET_NAME,
            Key: filename
        }));

        // Delete transcription file
        const transcriptKey = filename + '.transcription';
        await s3client.send(new DeleteObjectCommand({
            Bucket: process.env.MY_BUCKET_NAME,
            Key: transcriptKey
        }));

        return Response.json({ message: "File and transcription deleted successfully" });

    } catch (error) {
        console.error("Delete error:", error);
        return Response.json({ error: "Failed to delete file" }, { status: 500 });
    }
}

