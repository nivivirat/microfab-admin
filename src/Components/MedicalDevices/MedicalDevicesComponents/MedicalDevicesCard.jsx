// MedicalDevicesCard.js
import React from 'react';
import { Icon } from "@iconify/react";

const MedicalDevicesCard = ({ index, isOpen, onToggle, img, heading, content, onEdit, device }) => {
    // ... (existing code)

    const handleEdit = (e) => {
        e.stopPropagation(); // Prevent toggling the card when clicking edit
        onEdit(index, device); // Pass the index and device data to the parent
    }

    const toggleContent = () => {
        onToggle(index);
    }

    return (
        <div
            className={`md:w-[250px] w-full flex flex-col shadow-lg rounded-[20px]`}
            onClick={toggleContent}
        >
            <div className="h-[190px] w-full">
                <img
                    src={img}
                    alt="Medical Device"
                    className="w-full h-full rounded-[16px] object-cover"
                />
            </div>
            <div className="h-[60px] flex flex-row justify-between place-items-center p-5">
                <h3 className="text-[16px] font-semibold">{heading}</h3>
                <div className="bg-primary rounded-full text-white p-2" onClick={handleEdit}>
                    <Icon icon="carbon:edit" />
                </div>
            </div>
            {isOpen && (
                <p className="text-[14px] px-5 pb-5">{content}</p>
            )}
        </div>
    );
}

export default MedicalDevicesCard;