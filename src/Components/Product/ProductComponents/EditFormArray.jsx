import { useState } from "react";

const EditFormArray = ({ section, index, heading, content, onSave, onCancel }) => {
    const [editedContent, setEditedContent] = useState(content);
    const [editedHeading, setEditedHeading] = useState(heading);

    const handleSave = () => {
        onSave(section, index, editedContent, editedHeading);
    };

    return (
        <div className="fixed top-0 left-0 z-40 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center overflow-auto">
            <div className="bg-white p-6 rounded-md shadow-md w-[700px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Heading:</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:border-blue-500"
                    value={editedHeading}
                    onChange={(e) => setEditedHeading(e.target.value)}
                />

                <label className="block text-sm font-semibold text-gray-700 mb-2">Content:</label>
                <textarea
                    className="w-full p-2 border rounded-md mb-4 focus:outline-none h-[200px] focus:border-blue-500"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />

                <div className="mt-4 flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditFormArray;
