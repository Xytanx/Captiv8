import { useEffect, useRef, useState } from "react";
import SparklesIcon from "./SparklesIcon";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { transcriptionItemsToSrt } from "@/libs/awsTranscriptionHelpers";
import goNotoCurrentRegular from "@/fonts/GoNotoCurrent-Regular.ttf";
import goNotoCurrentBold from "@/fonts/GoNotoCurrent-Bold.ttf";
import TypewriterHover from "./TypewriterHover";

export default function ResultVideo({ filename, transcriptionItems }) {
  const videoUrl = process.env.NEXT_PUBLIC_AWS_VIDEO_URL + filename;
  const [loaded, setLoaded] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
  const [outlineColor, setOutlineColor] = useState('#000000');
  const [progress, setProgress] = useState(1);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.src = videoUrl;
    load();
  }, []);

  const load = async () => {
    const ffmpeg = ffmpegRef.current;
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    await ffmpeg.writeFile('tmp/goNotoCurrent-Regular.ttf', await fetchFile(goNotoCurrentRegular));
    await ffmpeg.writeFile('tmp/goNotoCurrent-Bold.ttf', await fetchFile(goNotoCurrentBold));
    setLoaded(true);
  };

  function toFFmpegColor(rgb){
    const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1,3);
    return '&H' +bgr+ '&';
  }

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    const srt = transcriptionItemsToSrt(transcriptionItems);
    await ffmpeg.writeFile(filename, await fetchFile(videoUrl));
    await ffmpeg.writeFile('subs.srt', srt);
    videoRef.current.src = videoUrl;
    await new Promise((resolve, reject)=>{
        videoRef.current.onloadedmetadata=resolve;
    });
    const duration=videoRef.current.duration;
    ffmpeg.on('log', ({ message }) => {
      const regexResult = /time=([0-9:.]+)/.exec(message);
      if(regexResult && regexResult?.[1]){
        const howMuchIsDone = regexResult?.[1]
        const [hours, minutes, seconds] = howMuchIsDone.split(':');
        const doneTotalSeconds = hours*3600 + minutes*60 + seconds;
        const videoProgress = doneTotalSeconds/duration;
        setProgress(videoProgress);
      }
    });
    await ffmpeg.exec([
      '-i', filename,
      '-preset', 'ultrafast',
      '-vf', `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Go Noto Current-Bold,FontSize=30,MarginV=70,PrimaryColour=${toFFmpegColor(primaryColor)},OutlineColour=${toFFmpegColor(outlineColor)}'`,
      'output.mp4'
    ]);
    const data = await ffmpeg.readFile('output.mp4');
    videoRef.current.src =
      URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      setProgress(1);
  };

  return (
    <>
      <div className="mb-4">
        <button
          onClick={transcode}
          className="
            bg-gradient-to-r from-purple-500 to-indigo-500
            hover:from-purple-600 hover:to-indigo-600
            text-white font-semibold
            py-2 px-6
            rounded-full inline-flex gap-2
            border-2 border-purple-700/40 cursor-pointer
            transform transition-all duration-200
            hover:scale-105 shadow-md
          "
          >
          <SparklesIcon />
          <TypewriterHover text="Captionize" />
        </button>
      </div>
      <div className="rows-2 justify mt-6 mb-8 items-center justify-center">
        <div className="flex items-center">
          <span className="text-lg mr-6">Text Color:</span>
          <input
            className=""
            type="color"
            value={primaryColor}
            onChange={(ev) => setPrimaryColor(ev.target.value)}
          />
        </div>
        <div className="flex items-center">
          <span className="text-lg mr-2">Outline Color:</span>
          <input
            type="color"
            value={outlineColor}
            onChange={(ev) => setOutlineColor(ev.target.value)}
          />
        </div>
      </div>  

      <div className="rounded-xl overflow-hidden relative">
        {progress && progress < 1 && (
            <div className="absolute inset-0 bg-black/80 flex items-center">
                <div className="w-full text-center">
                   
                    <div className="bg-gradient-to-r from-blue-400/50 to-green-500/50 mx-4 rounded-lg overflow-hidden relative">
                        <div className="bg-gradient-to-r from-blue-400 to-green-500 h-8" style={{width:progress*100+'%'}}>
                            <h3 className="text-white text-xl absolute inset-0 text-center">
                                {parseInt(progress*100)}%
                            </h3> 
                        </div>
                    </div>
                </div>
                
            </div>
        )}
        <video data-video={0} ref={videoRef} controls></video>
      </div>
    </>
  );
}
