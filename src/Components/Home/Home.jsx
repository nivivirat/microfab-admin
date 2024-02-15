import Analytics from "./HomeComponents/Analytics/Analytics"
import Graph from "./HomeComponents/Graph/Graph"
import MouldSlidePreview from "./HomeComponents/MouldSlide/MouldSlideComponents/MouldSlidePreview"

export default function Home() {
    return (
        <div className="mr-10 flex flex-col gap-10 justify-center py-5">
            <MouldSlidePreview />

            <Graph />

            <Analytics />
        </div>
    )
}