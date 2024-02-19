import { useState, useEffect } from "react";
import MouldSlide from "../MouldSlide";
import { onValue, ref, set } from "firebase/database";
import { db } from "../../../../../../firebase";
import { Icon } from "@iconify/react";
import { push } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function MouldSlidePreview() {
    const [data, setData] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
    const [newItemData, setNewItemData] = useState({
        line1: "",
        line2: "",
        order: 0,
        image: null,
        imageUrl: "", // Store the base64 data URL here
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataRef = ref(db, 'Home/MouldSlide');
                onValue(dataRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const dataObject = snapshot.val();
                        const dataArray = Object.values(dataObject);
                        const sortedData = dataArray.sort((a, b) => a.order - b.order);
                        setData(sortedData);
                    }
                });
            } catch (error) {
                console.error('Error fetching data from Firebase:', error.message);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditedData(data[index]);
    };

    const handleSaveChanges = async () => {
        if (editIndex !== null) {
            const newData = [...data];
            newData[editIndex] = editedData;

            try {
                await set(ref(db, 'Home/MouldSlide'), newData);
                console.log('Data updated successfully!');
                setEditIndex(null);
            } catch (error) {
                console.error('Error updating data:', error.message);
            }
        }
    };

    const handleAddNewItem = () => {
        setIsNewItemModalOpen(true);
    };

    const handleImageChange = (e) => {
        // Handle image file change and set the state accordingly
        const file = e.target.files[0];
        if (file) {
            setNewItemData({ ...newItemData, image: file });
        }
    };

    const handleSaveNewItem = async () => {
        try {
            // Convert image to base64
            if (newItemData.image) {
                // Log to check if newItemData is defined
                console.log('newItemData:', newItemData);

                // Generate a unique filename (e.g., using timestamp)
                const filename = `${Date.now()}_${newItemData.image.name}`;

                // Log to check if filename is generated correctly
                console.log('filename:', filename);

                // Create a storage reference
                console.log('filename:', filename);
                const imageRef = storageRef(db, `images/${filename}`);

                // Log to check if imageRef is created correctly
                console.log('imageRef:', imageRef);

                // Upload the image to Firebase Storage
                await uploadBytes(imageRef, newItemData.image);

                // Log to check if image is uploaded successfully
                console.log('Image uploaded successfully!');

                // Get the download URL of the uploaded image
                const imageUrl = await getDownloadURL(imageRef);

                // Log to check if imageUrl is retrieved correctly
                console.log('imageUrl:', imageUrl);

                // Create the data object to be stored in the database
                const updatedItemData = {
                    ...newItemData,
                    imageUrl: imageUrl,
                };

                // Increment the order value for new items
                updatedItemData.order = data.length > 0 ? data[data.length - 1].order + 1 : 0;

                // Log to check if updatedItemData is correct
                console.log('updatedItemData:', updatedItemData);

                // Update the database with the new item data
                const dbRef = ref(db, 'Home/MouldSlide');
                push(dbRef, updatedItemData);

                console.log('New item added successfully!');

                // Reset newItemData and close the modal
                setNewItemData({
                    line1: "",
                    line2: "",
                    order: 0,
                    image: null,
                    imageUrl: "",
                });
                setIsNewItemModalOpen(false);
            }
        } catch (error) {
            console.error('Error adding new item:', error.message);
        }
    };

    return (
        <div className="h-[60vh] px-10 border border-primary rounded-lg p-10 flex-row">
            <div className="h-full">
                <span className="font-extrabold text-3xl hover:text-primary">Mould Card Scroll</span>
                <div className="md:w-full md:h-full w-full h-[1350px] flex md:flex-row flex-col">
                    {/* right */}
                    <div className="md:w-3/12 w-full md:mt-[10px] md:h-full">
                        <div className="w-full md:h-[40%] h-[200px] md:m-0 m-4 mt-0 flex flex-row gap-3">
                            <div className="w-[50%] h-[200%] md:mr-0 mr-3">
                                <MouldSlide data={data} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-x-12">
                        {data.map((item, index) => (
                            <div key={item.order} className={`relative leading-5 h-[65px] w-[110px] px-5 rounded-[20px] flex flex-col justify-center place-items-center font-bold ${index % 2 === 0 ? 'bg-[#e9e9e9]' : 'bg-primary'}`}>
                                <div className={`h-[20px] w-[60px] place-items-center justify-center flex text-center ${index % 2 === 0 ? 'text-primary' : 'text-white'}`}>
                                    {item.imageUrl && <img src={item.image} alt={`Item ${index + 1}`} className="w-10 h-10 object-cover" />}
                                </div>
                                <p className="text-[14px] font-['ClashDisplay']">{item.line1}</p>
                                <p className="text-[14px] font-['ClashDisplay']">{item.line2}</p>
                                <p onClick={() => handleEdit(index)} className="cursor-pointer text-[20px] absolute -right-6 top-3"><Icon icon="typcn:edit" /></p>
                            </div>
                        ))}
                        <button onClick={handleAddNewItem} className="bg-primary h-[65px] w-[110px] text-white p-2 rounded-[20px] hover:bg-opacity-80">
                            Add New Item
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for editing */}
            {editIndex !== null && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded relative">
                        <button
                            onClick={() => {
                                setEditIndex(null);
                                setEditedData({});
                            }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                        >
                            X
                        </button>
                        <label htmlFor="editedLine1">Line 1:</label>
                        <input
                            type="text"
                            id="editedLine1"
                            value={editedData.line1}
                            onChange={(e) => setEditedData({ ...editedData, line1: e.target.value })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <label htmlFor="editedLine2">Line 2:</label>
                        <input
                            type="text"
                            id="editedLine2"
                            value={editedData.line2}
                            onChange={(e) => setEditedData({ ...editedData, line2: e.target.value })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <label htmlFor="editedOrder">Order:</label>
                        <input
                            type="number"
                            id="editedOrder"
                            value={editedData.order}
                            onChange={(e) => setEditedData({ ...editedData, order: parseInt(e.target.value, 10) })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <button
                            onClick={handleSaveChanges}
                            className="bg-primary text-white p-2 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:border-primary"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for adding a new item */}
            {isNewItemModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded relative">
                        <button
                            onClick={() => {
                                setNewItemData({
                                    line1: "",
                                    line2: "",
                                    order: 0,
                                    image: null,
                                    imageUrl: "",
                                });
                                setIsNewItemModalOpen(false);
                            }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                        >
                            X
                        </button>
                        <label htmlFor="newItemLine1">Line 1:</label>
                        <input
                            type="text"
                            id="newItemLine1"
                            value={newItemData.line1}
                            onChange={(e) => setNewItemData({ ...newItemData, line1: e.target.value })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <label htmlFor="newItemLine2">Line 2:</label>
                        <input
                            type="text"
                            id="newItemLine2"
                            value={newItemData.line2}
                            onChange={(e) => setNewItemData({ ...newItemData, line2: e.target.value })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <label htmlFor="newItemOrder">Order:</label>
                        <input
                            type="number"
                            id="newItemOrder"
                            value={newItemData.order}
                            onChange={(e) => setNewItemData({ ...newItemData, order: parseInt(e.target.value, 10) })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <label htmlFor="newItemImage">Image:</label>
                        <input
                            type="file"
                            id="newItemImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        {/* Display the image preview */}
                        {newItemData.image && (
                            <div className="mt-2">
                                <img src={URL.createObjectURL(newItemData.image)} alt="New Item Preview" className="w-32 h-32 object-cover" />
                            </div>
                        )}
                        <button
                            onClick={handleSaveNewItem}
                            className="bg-primary text-white p-2 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:border-primary"
                        >
                            Save New Item
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
