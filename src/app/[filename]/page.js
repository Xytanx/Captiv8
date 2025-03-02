'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { clearTranscriptionItems } from "@/libs/awsTranscriptionHelpers";
import axios from "axios";
import ResultVideo from "../components/ResultVideo";
import TranscriptionEditor from "../components/TranscriptionEditor";
import DeleteButton from "../components/DeleteButton";

export default function FilePage() {
  const { filename } = useParams();

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([]);

  useEffect(() => {
    getTranscription();
  }, [filename]);

  function getTranscription() {
    setIsFetchingInfo(true);
    axios.get('/api/transcribe?filename=' + filename).then(response => {
      setIsFetchingInfo(false);
      const status = response.data.status;
      const transcription = response.data?.transcription;
      if (status === 'IN_PROGRESS') {
        setIsTranscribing(true);
        setTimeout(getTranscription, 3000);
      } else {
        setIsTranscribing(false);
        if (transcription && transcription.results && transcription.results.items) {
          setAwsTranscriptionItems(clearTranscriptionItems(transcription.results.items));
        } else {
          // Handle the case when transcription data is not available:
          setAwsTranscriptionItems([]);
        }
      }
      
    });
  }

  if (isTranscribing) {
    return <div>Transcribing your video...</div>;
  }

  if (isFetchingInfo) {
    return <div>Fetching information...</div>;
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-8 sm:gap-16">
        <div>
          <h2 className="text-2xl mb-4 text-white/80">Transcription</h2>
          <TranscriptionEditor
            awsTranscriptionItems={awsTranscriptionItems}
            setAwsTranscriptionItems={setAwsTranscriptionItems}
          />
        </div>

        <div>
          <h2 className="text-2xl mb-4 text-white/80">Result</h2>
          <ResultVideo filename={filename} transcriptionItems={awsTranscriptionItems} />
          <div className="flex justify-end mt-4">
            <DeleteButton filename={filename} />
          </div>
        </div>
      </div>
    </div>
  );
}
