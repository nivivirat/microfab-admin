// ApplicationCard.js
import React, { useState } from 'react';

const ApplicationCard = ({ heading, content, img, isEditable, onSave, onCancel }) => {
    const [editedHeading, setEditedHeading] = useState(heading);
    const [editedContent, setEditedContent] = useState(content);
    const [editedImage, setEditedImage] = useState(img);

    const handleSave = () => {
        onSave(editedHeading, editedContent, editedImage);
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleImageChange = (e) => {
        // Handle image file change and set the state accordingly
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setEditedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="font-['ClashDisplay'] bg-white justify-center h-[280px] w-[300px] flex flex-col gap-5 drop-shadow-lg p-5 rounded-lg">
            {isEditable ? (
                <div className="text-priamry flex flex-row gap-2">
                    {/* Input field for editing heading */}
                    <input
                        type="text"
                        value={editedHeading}
                        onChange={(e) => setEditedHeading(e.target.value)}
                        className="mb-2 p-2 border w-[100px] border-gray-300 rounded-md"
                    />
                    {/* Input field for uploading image */}
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="mb-2 p-2 border border-gray-300 rounded-md"
                    />
                </div>
            ) : (
                <div className="text-priamry flex flex-row gap-2 place-items-center">
                    {img && <img src={editedImage} alt="application" className="h-10 w-10 object-contain" />}
                    <p className="text-primary text-[20px]">{heading}</p>
                </div>
            )}
            {isEditable ? (
                // Input field for editing content
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-full resize-none mb-2 p-2 border border-gray-300 rounded-md"
                />
            ) : (
                <p className="text-xs leading-6">{content}</p>
            )}
            <div className="flex justify-end">
                {isEditable && (
                    <>
                        {/* Save button for editing */}
                        <button
                            className="bg-primary text-white px-2 py-1 rounded-md mr-2"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        {/* Cancel button for editing */}
                        <button
                            className="bg-gray-300 text-black px-2 py-1 rounded-md"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ApplicationCard;
