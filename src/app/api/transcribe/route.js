import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { GetTranscriptionJobCommand, StartTranscriptionJobCommand, TranscribeClient } from "@aws-sdk/client-transcribe";


function getClient(){
    return new TranscribeClient({
        region: process.env.MY_AWS_REGION,
        credentials: {
            accessKeyId: process.env.MY_AWS_ACCESS_KEY,
            secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
        },
    });
}

function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9._-]/g, "");
}

function createTranscriptionCommand(filename) {
    const safeFilename = sanitizeFilename(filename);

    return new StartTranscriptionJobCommand({
        TranscriptionJobName: safeFilename,
        OutputBucketName: process.env.MY_BUCKET_NAME,
        OutputKey: safeFilename + '.transcription',
        IdentifyLanguage: true,
        Media:{
            MediaFileUri: 's3://' + process.env.MY_BUCKET_NAME + '/' + safeFilename,
        },
    });    
}


async function createTranscriptionJob(filename) {
    const transcribeClient = getClient();
    const transciptionCommand = createTranscriptionCommand(filename);
    return transcribeClient.send(transciptionCommand);
}

async function getJob(filename) {
    const transcribeClient = getClient();
    let jobStatusResult = null;
    try{
        const transcriptionJobStatusCommand = new GetTranscriptionJobCommand({
            TranscriptionJobName: filename,
        });
        jobStatusResult = await transcribeClient.send(transcriptionJobStatusCommand);
    } catch(e){}
    return jobStatusResult;
}

async function getTranscriptionFile(filename) {
    const transcriptionFile = filename + '.transcription';
    const s3client = new S3Client({
            region: process.env.MY_AWS_REGION,
            credentials: {
                accessKeyId: process.env.MY_AWS_ACCESS_KEY,
                secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
            },
    });
    const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.MY_BUCKET_NAME,
        Key: transcriptionFile,
    });
    
    let transcriptionFileResponse  = null;
    try{
        transcriptionFileResponse = await s3client.send(getObjectCommand);
    }
    catch(e){}
    if(transcriptionFileResponse){
        return JSON.parse(await streamToString(transcriptionFileResponse.Body));
    }
    return null;
}

async function streamToString(stream) {
    const chunks=[];
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        stream.on('error', reject);
    });
}

export async function GET(req) {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const filename = searchParams.get('filename');

    //find ready transcription
    const transcription = await getTranscriptionFile(filename);
    if(transcription){
        return Response.json({
            status: 'COMPLETED',
            transcription,
        });
    }

    //checking if already transcribing
    const existingJob = await getJob(filename);
    if (existingJob){
        return Response.json({
        status: existingJob.TranscriptionJob.TranscriptionJobStatus,
    })
    }
    if(!existingJob)
    {
        const newJob = await createTranscriptionJob(filename);   
        return Response.json({
            status: newJob.TranscriptionJob.TranscriptionJobStatus,
        });
    }

    return Response.json(null);
}