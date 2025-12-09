export const ScorePlaceholder = () => {
    return (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <div className="text-center text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.597l.317-.107 1.94-.658a2.25 2.25 0 011.685.228v-3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.597l.317-.107 1.94-.658a2.25 2.25 0 011.685.228V9zm-10.5-3v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.597l.317-.107 1.94-.658a2.25 2.25 0 011.685.228V6z" />
                </svg>
                <div className="font-semibold">Score Renderer</div>
                <div className="text-sm">ABC Notation will be rendered here</div>
            </div>
        </div>
    );
};
