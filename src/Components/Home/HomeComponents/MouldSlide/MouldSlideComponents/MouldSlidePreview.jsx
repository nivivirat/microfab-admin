import MouldSlide from "../MouldSlide"

export default function MouldSlidePreview() {
    return (
        <div className="h-[60vh] px-10 border border-primary rounded-lg p-10 flex-row">
            <div className="h-full">
                <span className="font-extrabold text-3xl hover:text-primary ">Mould Card Scroll</span>
                <div className="md:w-full md:h-full w-full h-[1350px] flex md:flex-row flex-col">

                    {/* right */}
                    <div className="md:w-3/12 w-full md:mt-[10px] md:h-full">

                        <div className="w-full md:h-[40%] h-[200px] md:m-0 m-4 mt-0 flex flex-row gap-3">
                            <div className="w-[50%] h-[200%] md:mr-0 mr-3">
                                <MouldSlide />
                            </div>
                        </div>
                    </div>
                    <div>
                        backend code here
                    </div>
                </div>
            </div>

        </div>
    )
}