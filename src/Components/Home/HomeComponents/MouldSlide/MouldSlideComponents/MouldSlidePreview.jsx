import { useState, useEffect } from "react";
import MouldSlide from "../MouldSlide";
import { onValue, ref, set } from "firebase/database";
import { db, storage } from "../../../../../../firebase";
import { uploadImage } from '../../../../MedicalDevices/firebase'; // Adjust the import based on your actual file structure
import { Icon } from "@iconify/react";
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";

export default function MouldSlidePreview() {
    const [topData, setTopData] = useState([]);
    const [middleData, setMiddleData] = useState([]);
    const [bottomData, setBottomData] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [section, setSection] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const topDataRef = ref(db, 'Home/MouldSlide/top');
                const middleDataRef = ref(db, 'Home/MouldSlide/middle');
                const bottomDataRef = ref(db, 'Home/MouldSlide/bottom');

                const fetchSectionData = async (sectionPath, setData) => {
                    const sectionDataRef = ref(db, sectionPath);
                    onValue(sectionDataRef, (snapshot) => {
                        if (snapshot.exists()) {
                            const dataObject = snapshot.val();
                            const dataArray = Object.values(dataObject);
                            const sortedData = dataArray.sort((a, b) => a.order - b.order);
                            setData(sortedData);
                        }
                    });
                };

                await Promise.all([
                    fetchSectionData('Home/MouldSlide/top', setTopData),
                    fetchSectionData('Home/MouldSlide/middle', setMiddleData),
                    fetchSectionData('Home/MouldSlide/bottom', setBottomData),
                ]);
            } catch (error) {
                console.error('Error fetching data from Firebase:', error.message);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (index, type) => {
        setEditIndex({ index, type });
        const data = type === 'top' ? topData : type === 'middle' ? middleData : bottomData;
        setEditedData(data[index]);
        setSection(type);
    };

    const handleSaveChanges = async () => {
        if (editIndex !== null) {
            const { index, type } = editIndex;
            const dataToUpdate = type === 'top' ? [...topData] : type === 'middle' ? [...middleData] : [...bottomData];

            // Check if a new image is selected
            const newImgURL = imageFile ? await uploadImage(imageFile, 'Home/MouldSlide', type) : editedData.imageUrl;

            // Update the data
            dataToUpdate[index] = { ...editedData, imageUrl: newImgURL };

            try {
                const dbRef = ref(db, `Home/MouldSlide/${type}`);
                await set(dbRef, dataToUpdate);
                console.log('Data updated successfully!');
                setEditIndex(null);
                setImageFile(null); // Reset the image file after save
            } catch (error) {
                console.error('Error updating data:', error.message);
            }
        }
    };

    const handleImageUpload = async (file, index) => {
        try {

            setLoading(true);
            // Generate a unique filename based on timestamp, type, and item index
            const timestamp = Date.now();
            const fileName = `${section}_${index.index}_${timestamp}_${file.name}`;

            // Create a storage reference with the specified filename
            const storageReference = storageRef(storage, `Home/Mould/${section}/${fileName}`);

            // Convert the file to a Data URL
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                const dataURL = reader.result;

                // Upload the Data URL to the specified storage reference
                await uploadString(storageReference, dataURL, 'data_url');

                // Get the download URL of the uploaded image
                getDownloadURL(storageReference)
                    .then((imageUrl) => {
                        // Update the state with the new imageUrl
                        setEditedData({ ...editedData, imageUrl });

                        alert("image uploaded successfully")
                    })
                    .catch((error) => {
                        console.error('Error getting download URL:', error.message);
                    });

                const timerId = setTimeout(() => {
                    setLoading(false);
                }, 2000);

                // Cleanup the timer to avoid memory leaks
                return () => clearTimeout(timerId);

            };
        } catch (error) {
            console.error('Error uploading image:', error.message);
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
                                <MouldSlide />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-x-24">
                        {middleData.map((item, index) => (
                            <div key={item.order} className={`relative leading-5 h-[65px] w-[110px] px-5 rounded-[20px] flex flex-col justify-center place-items-center font-bold ${index % 2 === 0 ? 'bg-white border border-primary' : 'bg-primary'}`}>
                                <div className={`h-[20px] w-[60px] place-items-center justify-center flex text-center ${index % 2 === 0 ? 'text-primary' : 'text-white'}`}>
                                    
                                    {item.imageUrl && <img src={item.imageUrl} alt={`${index + 1}`} className="py-1 pt-3 w-10 h-10 object-contain" />}
                                </div>
                                <p className="text-[14px] font-['ClashDisplay'] mt-2">{item.line1}</p>
                                <p className="text-[14px] font-['ClashDisplay']">{item.line2}</p>
                                <p onClick={() => handleEdit(index, 'middle')} className="cursor-pointer text-[20px] absolute -right-6 top-3"><Icon icon="typcn:edit" /></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal for editing */}
            {editIndex !== null && (
                <div className="fixed top-0 z-50 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg relative w-96">
                        <h1 className="font-bold text-[20px]">Edit Mould Slide Content</h1>
                        <button
                            onClick={() => {
                                setEditIndex(null);
                                setEditedData({});
                            }}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                        >
                            <span className="text-xl">&#10005;</span>
                        </button>
                        {/* Render form inputs based on type (top, middle, bottom) */}
                        <label htmlFor="editedLine1" className="block text-sm font-semibold mt-4">Line 1:</label>
                        <input
                            type="text"
                            id="editedLine1"
                            value={editedData.line1}
                            onChange={(e) => setEditedData({ ...editedData, line1: e.target.value })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <label htmlFor="editedLine2" className="block text-sm font-semibold mt-4">Line 2:</label>
                        <input
                            type="text"
                            id="editedLine2"
                            value={editedData.line2}
                            onChange={(e) => setEditedData({ ...editedData, line2: e.target.value })}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <label htmlFor="editedImage" className="block text-sm font-semibold mt-4">Image:</label><span className="text-red-400">The image must have no-background</span><br></br><span className="text-red-400">Image dimension 10px * 10px</span>
                        <input
                            type="file"
                            id="editedImage"
                            onChange={(e) => handleImageUpload(e.target.files[0], editIndex)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-primary focus:ring focus:ring-primary"
                        />
                        <button
                            onClick={handleSaveChanges}
                            className={`mt-6 bg-primary text-white p-2 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:border-primary ${loading ? 'cursor-wait opacity-50' : '' // Disable pointer events and reduce opacity when loading
                                }`}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
