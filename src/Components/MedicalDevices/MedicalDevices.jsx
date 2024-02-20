import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { getDatabase, ref, set, onValue } from 'firebase/database';

export default function MedicalDevices() {
    const [medicalDevicesData, setMedicalDevicesData] = useState({});
    const [editItem, setEditItem] = useState(null);
    const [editedOrder, setEditedOrder] = useState('');
    const [editedHeading, setEditedHeading] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedImg, setEditedImg] = useState('');

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
            await set(ref(database, `MedicalDevices/${deviceKey}`), {
                order: editedOrder,
                heading: editedHeading,
                content: editedContent,
                img: editedImg,
            });

            console.log(`Saving edited content for ${deviceKey}: Order: ${editedOrder}, Heading: ${editedHeading}, Content: ${editedContent}, Img: ${editedImg}`);

            setEditItem(null);
        } catch (error) {
            console.error('Error saving data:', error.message);
            // Handle error, show user feedback, etc.
        }
    };

    return (
        <div className="container mx-auto my-8">
            <h1 className="text-3xl font-bold mb-4">Medical Devices</h1>
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
                                <td className="py-2 px-4 border-b">{editItem === deviceKey ? <input type="text" value={editedImg} onChange={(e) => setEditedImg(e.target.value)} className="w-full border p-2" /> : <img src={medicalDevicesData[deviceKey].img} alt={medicalDevicesData[deviceKey].heading} className="w-16 h-16 object-cover rounded" />}</td>
                                <td className="py-2 px-4 border-b">
                                    {editItem === deviceKey ? (
                                        <button onClick={() => handleSave(deviceKey)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                                            Save
                                        </button>
                                    ) : (
                                        <button onClick={() => handleEdit(deviceKey)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                                            Edit
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
