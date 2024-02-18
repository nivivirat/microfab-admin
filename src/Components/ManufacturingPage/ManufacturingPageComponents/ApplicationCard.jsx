export default function ApplicationCard({ heading, content, img }) {
    const images = {
    }

    return (
        <div className="font-['ClashDisplay'] bg-white justify-center h-[280px] w-[300px] flex flex-col gap-5 drop-shadow-lg p-5 rounded-lg">
            <div className="text-priamry flex flex-row gap-2">
                {img && <img src={images[img]} alt="application" className="" />}
                <p className="text-primary text-[20px]">{heading}</p>
            </div>
            <p className="text-xs leading-6">{content}</p>
        </div>
    );
}
