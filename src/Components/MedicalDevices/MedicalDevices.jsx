import React, { useState, useEffect } from 'react';
import { uploadImage } from './firebase';
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import Catheters_IV from '../../assets/medicalDevices/Catheters_IV.svg';
import Cannula_Scalp from '../../assets/medicalDevices/Cannula_Scalp.svg';
import Vein_Sets from '../../assets/medicalDevices/Vein_Sets.svg';
import IV_Infusion_Pump_Sets from '../../assets/medicalDevices/IV_Infusion_Pump_Sets.svg';
import IV_Fluid_Bags from '../../assets/medicalDevices/IV_Fluid_Bags.svg';
import IV_Tubing from '../../assets/medicalDevices/IV_Tubing.svg';
import Syringes from '../../assets/medicalDevices/Syringes.svg';
import IV_Extension_Sets from '../../assets/medicalDevices/IV_Extension_Sets.svg';
import IV_Stopcocks from '../../assets/medicalDevices/IV_Stopcocks.svg';
import IV_Filters from '../../assets/medicalDevices/IV_Filters.svg';
import IV_Blood_Administration_Sets from '../../assets/medicalDevices/IV_Blood_Administration_Sets.svg';
import Infusion_Set_Needles from '../../assets/medicalDevices/Infusion_Set_Needles.svg';
import Pressure_Infusors from '../../assets/medicalDevices/Pressure_Infusors.svg';
import IV_Drip_Chambers from '../../assets/medicalDevices/IV_Drip_Chambers.svg';
import Safety_IV_Cathers from '../../assets/medicalDevices/Safety_IV_Cathers.svg';
import IV_Administration_Sets_with_Flow_Regulators from '../../assets/medicalDevices/IV_Administration_Sets_with_Flow_Regulators.svg';
import Peripheral_IV_Cannula_Dressing_Kits from '../../assets/medicalDevices/Peripheral_IV_Cannula_Dressing_Kits.svg';

import SystemforFormulationLine from '../../assets/turnkeySolutions/SystemforFormulationLine.svg'
import CIPSystems from '../../assets/turnkeySolutions/CIPSystems.svg'
import MixingTanks from '../../assets/turnkeySolutions/MixingTanks.svg'
import PressureVessels from '../../assets/turnkeySolutions/PressureVessels.svg'

export default function MedicalDevices() {
    const [medicalDevicesData, setMedicalDevicesData] = useState({});
    const [editItem, setEditItem] = useState(null);
    const [editedOrder, setEditedOrder] = useState('');
    const [editedHeading, setEditedHeading] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedImg, setEditedImg] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const images = {
        CIPSystems,
        MixingTanks,
        PressureVessels,
        SystemforFormulationLine,
        Catheters_IV,
        Cannula_Scalp,
        Vein_Sets,
        IV_Infusion_Pump_Sets,
        IV_Fluid_Bags,
        IV_Tubing,
        Syringes,
        IV_Extension_Sets,
        IV_Stopcocks,
        IV_Filters,
        IV_Blood_Administration_Sets,
        Infusion_Set_Needles,
        Pressure_Infusors,
        IV_Drip_Chambers,
        Safety_IV_Cathers,
        IV_Administration_Sets_with_Flow_Regulators,
        Peripheral_IV_Cannula_Dressing_Kits,

    };

    const database = getDatabase();

    useEffect(() => {
        const deviceRef = ref(database, 'MedicalDevices');
        const unsubscribe = onValue(deviceRef, (snapshot) => {
            setMedicalDevicesData(snapshot.val());
        });

        return () => {
            // Unsubscribe from the database reference when the component unmounts
            unsubscribe();
        };
    }, []);

    const handleEdit = (deviceKey) => {
        setEditItem(deviceKey);
        setEditedOrder(medicalDevicesData[deviceKey].order);
        setEditedHeading(medicalDevicesData[deviceKey].heading);
        setEditedContent(medicalDevicesData[deviceKey].content);
        setEditedImg(medicalDevicesData[deviceKey].img);
    };

    const handleSave = async (deviceKey) => {
        try {
            // Upload the image file and get the download URL
            const newImgURL = imageFile ? await uploadImage(imageFile, `medicalDevices/${deviceKey}/img`) : editedImg;

            // Update the data in the database
            await set(ref(database, `MedicalDevices/${deviceKey}`), {
                order: editedOrder,
                heading: editedHeading,
                content: editedContent,
                img: newImgURL, // Use the new download URL
            });

            console.log(`Saving edited content for ${deviceKey}: Order: ${editedOrder}, Heading: ${editedHeading}, Content: ${editedContent}, Img: ${newImgURL}`);

            setEditItem(null);
            setImageFile(null); // Reset the image file after save
        } catch (error) {
            console.error('Error saving data:', error.message);
            // Handle error, show user feedback, etc.
        }
    };

    const handleAddNew = async () => {
        try {
            // Upload the image file and get the download URL
            const newImgURL = imageFile ? await uploadImage(imageFile, `medicalDevices/new/img`) : '';

            // Push new data to the database
            const newDeviceRef = push(ref(database, 'MedicalDevices'));
            const newDeviceKey = newDeviceRef.key;

            await set(newDeviceRef, {
                order: '0', // Set order as 1
                heading: '',
                content: '', // Set content as an empty string
                img: newImgURL,
            });

            console.log(`Adding new content: Order: 1, Heading: ${editedHeading}, Content: '', Img: ${newImgURL}`);
            alert('New card added with empty content and order 0 : Edit your content');
            setImageFile(null); // Reset the image file after save
        } catch (error) {
            console.error('Error adding new data:', error.message);
            // Handle error, show user feedback, etc.
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleDelete = async (deviceKey) => {
        // Use window.confirm to show a browser-level confirmation dialog
        const confirmed = window.confirm("Are you sure you want to delete this item?");

        if (!confirmed) {
            // If the user cancels the deletion, return early
            return;
        }

        try {
            // Delete the data from the database
            await set(ref(database, `MedicalDevices/${deviceKey}`), null);
            console.log(`Deleting content for ${deviceKey}`);
        } catch (error) {
            console.error('Error deleting data:', error.message);
            // Handle error, show user feedback, etc.
        }
    };

    return (
        <div className="container mx-auto my-8">
            <div className='flex justify-between my-5 flex-row place-items-center'>
                <h1 className="text-3xl font-bold mt-5">Medical Devices</h1>
                <div className="mt-4">
                    <button onClick={handleAddNew} className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                        Add New
                    </button>
                </div>
            </div>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-2 px-4 border-b">Order</th>
                        <th className="py-2 px-4 border-b">Medical Device</th>
                        <th className="py-2 px-4 border-b">Content</th>
                        <th className="py-2 px-4 border-b">Image</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(medicalDevicesData)
                        .sort((a, b) => medicalDevicesData[a].order - medicalDevicesData[b].order)
                        .map((deviceKey, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <td className="py-2 px-4 border-b">{editItem === deviceKey ? <input type="text" value={editedOrder} onChange={(e) => setEditedOrder(e.target.value)} className="w-full border p-2" /> : medicalDevicesData[deviceKey].order}</td>
                                <td className="py-2 px-4 border-b h-[250px]">{editItem === deviceKey ? <input type="text" value={editedHeading} onChange={(e) => setEditedHeading(e.target.value)} className="w-full border p-2" /> : medicalDevicesData[deviceKey].heading}</td>
                                <td className="py-2 px-4 border-b">{editItem === deviceKey ? <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full border p-2 h-[250px]" /> : medicalDevicesData[deviceKey].content}</td>
                                <td className="py-2 px-4 border-b">
                                    {editItem === deviceKey ? (
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="mb-2"
                                            />
                                            {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-[300px] h-[230px] object-cover rounded mb-2" />}
                                        </div>
                                    ) : (
                                        <img src={images[medicalDevicesData[deviceKey].img] || medicalDevicesData[deviceKey].img } alt={medicalDevicesData[deviceKey].heading} className="w-[500px] h-[230px] object-cover rounded" />
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {editItem === deviceKey ? (
                                        <div>
                                            <button onClick={() => handleSave(deviceKey)} className="bg-blue-500 w-[70px] mb-5 text-white px-2 py-1 rounded mr-2">
                                                Save
                                            </button>
                                            <button onClick={() => setEditItem(null)} className="bg-gray-500 w-[70px] text-white px-2 py-1 rounded">
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(deviceKey)} className="bg-green-500 text-white px-2 py-1 w-[70px] mb-5 rounded mr-2">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(deviceKey)} className="bg-red-500 text-white px-2 py-1 w-[70px] rounded">
                                                Delete
                                            </button> 
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
