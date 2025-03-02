import SparklesIcon from "./SparklesIcon";

export default function DemoSection() {
    const withSubs = process.env.NEXT_PUBLIC_AWS_VIDEO_URL + "with-captions.mp4";
    const withoutSubs = process.env.NEXT_PUBLIC_AWS_VIDEO_URL + "without-captions.mp4";

    return(
        <section className="flex justify-around mt-8 sm:mt-12 items-center">
            <div className="hidden sm:block bg-gray-800/50 w-[240px] h-[480px] rounded-xl overflow-hidden">
                <video src={withoutSubs} preload="true" muted autoPlay loop></video>
            </div>
            <div className="hidden sm:block"><SparklesIcon/></div>
            <div className="bg-gray-800/50 w-[240px] h-[480px] rounded-xl">
                <video src={withSubs} preload="true" muted autoPlay loop></video>
            </div>
        </section>
    )
}
