import { Icon } from "@iconify/react";
import { useState } from "react";

export default function MedicalDevicesCard({
    index,
    isOpen,
    onToggle,
    img: initialImg,
    heading: initialHeading,
    content: initialContent,
}) {
    const toggleContent = () => {
        onToggle(index);
    };

    const [showContent, setShowContent] = useState(false);
    const [img, setImg] = useState(initialImg);
    const [heading, setHeading] = useState(initialHeading);
    const [content, setContent] = useState(initialContent);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveChanges = () => {
        // Implement the logic to save the edited data
        // You can use a callback function passed as a prop or update directly in the component
        // For simplicity, let's use console.log to log the edited values
        console.log("Edited values:", { img, heading, content });
        setIsEditing(false);
    };

    console.log("lgfffffffff");

    return (
        <div
            className={`md:m-2 lg:w-[22%] md:w-[250px] w-full flex flex-col relative shadow-lg rounded-[20px]`}
            onClick={toggleContent}
        >
            <div className="md:h-[190px] w-full">
                <img
                    src={images[img] || img}
                    alt="Medical Device"
                    className="w-full h-full rounded-[16px] object-cover"
                />
            </div>
            <div className="md:h-[60px] flex flex-row justify-between place-items-center p-5">
                <h3 className="text-[16px] font-semibold">{heading}</h3>
                {isOpen ? (
                    <div className="bg-primary rounded-full text-white p-2">
                        <Icon icon="ic:baseline-minus" />
                    </div>
                ) : (
                    <div className="bg-primary rounded-full text-white p-2">
                        <Icon icon="ic:baseline-plus" />
                    </div>
                )}
            </div>
            {isOpen && (
                <p className="text-[14px] font-thin opacity-70 px-5 pb-5">{content}</p>
            )}
            <div>
                {isEditing ? (
                    <form className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-[20px] shadow-md">
                        <label className="block mb-4">
                            Image URL:
                            <input
                                type="text"
                                value={img}
                                onChange={(e) => setImg(e.target.value)}
                                className="w-full border rounded p-2 mt-2"
                            />
                        </label>
                        <label className="block mb-4">
                            Heading:
                            <input
                                type="text"
                                value={heading}
                                onChange={(e) => setHeading(e.target.value)}
                                className="w-full border rounded p-2 mt-2"
                            />
                        </label>
                        <label className="block mb-4">
                            Content:
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full border rounded p-2 mt-2"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={handleSaveChanges}
                            className="bg-primary text-white rounded-full py-2 px-4 hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div className="relative">
                        <button
                            type="button"
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full py-2 px-4 hover:bg-blue-700"
                            onClick={handleEditClick}
                        >
                            Edit Content
                        </button>
                        <p className="text-[14px] font-thin opacity-70 px-5 pb-5">{content}</p>
                    </div>
                )}
            </div>

        </div>
    );
}
