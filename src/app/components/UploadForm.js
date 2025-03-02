import axios from "axios";
import UploadIcon from "./UploadIcon";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadForm() {
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const router = useRouter();

    // Allowed video formats (AWS Transcribe supported)
    const allowedFormats = ["video/mp4", "video/webm"];

    async function upload(ev) {
        ev.preventDefault();
        setErrorMessage(null); // Reset error message on new upload attempt

        const files = ev.target.files;

        if (files.length > 0) {
            const file = files[0];

            // Check file format
            if (!allowedFormats.includes(file.type)) {
                setErrorMessage("❌ Unsupported file format. Please upload an MP4 or WebM video.");
                return;
            }

            setIsUploading(true);
            try {
                const res = await axios.postForm('/api/upload', { file });
                setIsUploading(false);
                const newName = res.data.newName;
                router.push('/' + newName);
            } catch (error) {
                setIsUploading(false);
                console.error("Upload error:", error);

                // Handle file size error from server
                if (error.response && error.response.status === 413) {
                    setErrorMessage("❌ File too large. Please upload a smaller video.");
                } else {
                    setErrorMessage("⚠️ Upload failed. Please refresh the page and try again.");
                }
            }
        }
    }

    return (
        <>
            {isUploading && (
                <div className="bg-black/90 text-white fixed inset-0 flex items-center">
                    <div className="w-full text-center">
                        <h2 className="text-4xl mb-4">Uploading...</h2>
                        <h3 className="text-xl">Please wait</h3>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-600 text-white px-4 py-2 rounded-md mt-2 text-center">
                    {errorMessage}
                </div>
            )}

            <label className="bg-gradient-to-r from-green-500 to-green-600 
                hover:from-green-400/90 hover:to-green-500 
                text-white font-semibold 
                py-2 px-6 
                rounded-full inline-flex gap-2 
                border-2 border-purple-700/50 cursor-pointer 
                transform transition-all duration-200 
                hover:scale-105 shadow-md mt-4">
                <UploadIcon />
                <span>Choose file</span>
                <input 
                    onChange={upload} 
                    type="file" 
                    className="hidden" 
                    accept="video/mp4,video/webm"  // Restrict file picker to MP4 and WebM
                />
            </label>
        </>
    );
}
