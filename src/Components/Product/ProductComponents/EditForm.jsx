import React, { useState } from 'react';

const EditForm = ({ section, index, heading, content, onSave, onCancel }) => {
    const [editedContent, setEditedContent] = useState(content);

    const handleSave = () => {
        onSave(section, index, editedContent);
    };

    return (
        <div className="bg-gray-200 p-4 rounded-md shadow-md">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{heading}:</label>
            <textarea
                className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
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
    );
};

export default EditForm;
