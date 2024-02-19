import React, { useEffect, useState } from 'react';
import { db, storage } from '../../../../../firebase';
import { ref, get, update } from 'firebase/database';
import { getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage';

const TurnKey = () => {
    const [data, setData] = useState([]);
    const [editedData, setEditedData] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await get(ref(db, 'Home/water_TS_Data'));
                const fetchedData = snapshot.val();
                setData(fetchedData);
                setEditedData(fetchedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = () => {
        setEditMode(true);
        // Clone the data to prevent direct modification
        setEditedData([...data]);
    };

    const handleSaveClick = async () => {
        setEditMode(false);

        try {
            // Save formatted data back to the database
            await update(ref(db, 'Home/water_TS_Data'), editedData);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };


    const handleInputChange = (index, field, value) => {
        const newData = [...editedData];
        newData[index][field] = value;
        setEditedData(newData);
    };

    const handleImageChange = async (e, index, imageField) => {
        const selectedImage = e.target.files[0];
        const storageRefImg = storageRef(storage, `images/${selectedImage.name}`);
        
        try {
            // Upload image to storage
            const snapshot = await uploadBytes(storageRefImg, selectedImage);
            // Get download URL
            const imageUrl = await getDownloadURL(snapshot.ref);

            const newData = [...editedData];
            newData[index][imageField] = imageUrl;
            setEditedData(newData);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <div className='flex flex-row justify-between place-items-center'>
                <h2 className="text-2xl font-bold mb-4">Turnkey Data</h2>
                {!editMode ?
                    <button
                        onClick={handleEditClick}
                        className="bg-green-500 text-white px-4 py-2 mb-3 rounded-md mt-4"
                    >
                        Edit Data
                    </button>
                    :
                    <button
                        onClick={handleSaveClick}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Save
                    </button>
                }
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        {/* <th className="border border-gray-300 px-4 py-2 w-[100px]">Image (imgl)</th>
                        <th className="border border-gray-300 px-4 py-2 w-[100px]">Image (imgr)</th> */}
                        <th className="border border-gray-300 px-4 py-2 w-[200px]">Heading</th>
                        <th className="border border-gray-300 px-4 py-2">Content</th>
                    </tr>
                </thead>
                <tbody>
                    {editedData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            {/* <td className="border border-gray-300 px-4 py-2">
                                {editMode ?
                                    <input
                                        type="file"
                                        onChange={(e) => handleImageChange(e, index, 'imgl')}
                                        className="border border-gray-300 p-2 mt-2 w-[100px]"
                                        accept=".png, .jpg, .jpeg, .svg"
                                    />
                                    :
                                    item.imgl && <img src={item.imgl} alt="Preview" className="w-12 h-12 object-cover" />
                                }
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {editMode ?
                                    <input
                                        type="file"
                                        onChange={(e) => handleImageChange(e, index, 'imgr')}
                                        className="border border-gray-300 p-2 mt-2 w-[100px]"
                                        accept=".png, .jpg, .jpeg, .svg"
                                    />
                                    :
                                    item.imgr && <img src={item.imgr} alt="Preview" className="w-12 h-12 object-cover" />
                                }
                            </td> */}
                            {!editMode ?
                                <td className="border border-gray-300 px-4 py-2">{item.heading}</td>
                                :
                                <td>
                                    <input
                                        type="text"
                                        value={item.heading}
                                        onChange={(e) => handleInputChange(index, 'heading', e.target.value)}
                                        className="border border-gray-300 p-2"
                                    />
                                </td>
                            }
                            {!editMode ?
                                <td className="border border-gray-300 px-4 py-2">{item.content}</td>
                                :
                                <td>
                                    <textarea
                                        value={item.content}
                                        onChange={(e) => handleInputChange(index, 'content', e.target.value)}
                                        className="border border-gray-300 h-full w-full p-2 resize-none"
                                    />
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TurnKey;
