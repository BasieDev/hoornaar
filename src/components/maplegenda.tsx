export default function MapLegenda() {
    return (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center z-50">
            <div className="h-[58px] bg-[#BE895B] rounded-full flex items-center justify-between my-3 w-full max-w-7xl mx-[13px]">
                <div className="flex gap-8 mx-auto">
                    <span className="text-white underline decoration-[#FF8585] decoration-2 underline-offset-7">Bij</span>                    
                    <span className="text-white underline decoration-[#FF3434] decoration-2 underline-offset-7">Bijenkorf</span>
                    <span className="text-white underline decoration-[#9288FF] decoration-2 underline-offset-7">Hoornaar</span>
                    <span className="text-white underline decoration-[#6D60FA] decoration-2 underline-offset-7">Wespennest</span>
                </div>
            </div>
        </div>
    );
}
