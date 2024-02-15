import AnalyticsPreview from "./AnalyticsComponents/AnalyticsPreview";

export default function Analytics() {
    return (
        <div className="px-10 border border-primary rounded-lg p-10 flex-row">
            <div className="h-full">
                <span className="font-extrabold text-3xl hover:text-primary">Analytics</span>
                <div>
                    <AnalyticsPreview />
                </div>
            </div>
        </div>
    )
}