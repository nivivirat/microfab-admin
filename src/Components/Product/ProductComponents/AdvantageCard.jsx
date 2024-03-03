// AdvantageCard.js
import React, { useState } from 'react';

const AdvantageCard = ({ heading, content, isEditable, onSave, onCancel }) => {
  const [editedHeading, setEditedHeading] = useState(heading);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onSave(editedHeading, editedContent);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="font-['ClashDisplay'] xl:h-[230px] h-[100%] w-[370px] rounded-lg p-4 flex flex-col bg-white">
      <div className="mb-2 font-semibold">
        {isEditable ? (
          <input
            type="text"
            value={editedHeading}
            onChange={(e) => setEditedHeading(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded-md"
          />
        ) : (
          editedHeading
        )}
      </div>
      {isEditable ? (
        <>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full resize-none mb-2 p-2 border border-gray-300 rounded-md"
          />
          <div className="flex justify-end">
            <button
              className="bg-primary text-white px-2 py-1 rounded-md mr-2"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-300 text-black px-2 py-1 rounded-md"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="pr-7">{content}</div>
      )}
    </div>
  );
};

export default AdvantageCard;
