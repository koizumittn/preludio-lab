export const AudioPlayerPlaceholder = () => {
    return (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-black text-white shadow-lg">
            <div className="text-center">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                <div className="font-semibold">YouTube Player</div>
                <div className="text-sm text-gray-400">Audio Sync Ready</div>
            </div>
        </div>
    );
};
