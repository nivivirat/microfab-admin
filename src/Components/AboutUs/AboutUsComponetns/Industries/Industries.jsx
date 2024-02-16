// Industries.jsx

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const storageInstance = getStorage();
const industriesRef = ref(getDatabase(), "AboutUs/Industries");

export default function Industries() {
    const [categories, setCategories] = useState([]);
    const [fileInput, setFileInput] = useState(null);
    const [titleInput, setTitleInput] = useState("");
    const [linkInput, setLinkInput] = useState("");
    const [orderInput, setOrderInput] = useState(0);
    const [isAddingNewCard, setIsAddingNewCard] = useState(false);

    useEffect(() => {
        // Fetch categories from Firebase
        const unsubscribe = onValue(industriesRef, (snapshot) => {
            const categoriesData = snapshot.val();
            if (categoriesData) {
                const categoriesArray = Object.entries(categoriesData).map(([id, data]) => ({
                    id,
                    ...data,
                }));
                setCategories(categoriesArray);
            }
        });

        return () => unsubscribe();
    }, []);

    const clearInputFields = () => {
        setFileInput(null);
        setTitleInput("");
        setLinkInput("");
        setOrderInput(0);
        setIsAddingNewCard(false);
    };

    const handleFileUpload = async (file) => {
        // Upload image to Firebase Storage
        const fileRef = storageRef(storageInstance, file.name);
        await uploadBytes(fileRef, file);
        const imageUrl = await getDownloadURL(fileRef);

        // Add new category with the uploaded image URL and additional fields to Firebase Realtime Database
        push(industriesRef, {
            title: titleInput || "New Category",
            image: imageUrl,
            link: linkInput || "/new-category",
            order: orderInput || 0,
        });

        // Reset input fields after uploading
        clearInputFields();
    };

    const handleAddNewCard = () => {
        // Trigger this function when the "Add New Card" button is clicked with a new file
        if (fileInput) {
            handleFileUpload(fileInput);
        } else {
            console.error("No file selected");
        }
    };

    return (
        <div className="relative px-10 border border-primary rounded-lg p-10 flex-row">
            <div className="absolute top-0 right-5">
                <button
                    type="button"
                    onClick={() => setIsAddingNewCard(true)}
                    className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md"
                >
                    Add New Card
                </button>
            </div>
            <center>
                <div className="flex flex-col rounded-lg bg-white md:max-w-6xl md:flex-row  animate__animated animate__fadeInRight animate__delay-1s">
                    <div className="flex flex-col p-6">
                        <p className="mb-4 text-5xl ddd leading-tight font-['ClashDisplay']  mr-4">
                            <strong>Industries that we serve</strong>
                        </p>
                        <center>
                            <p className="mb-1 text-2xs ddd text-[#8AA6AA] leading-tight mr-4 pp font-['ClashDisplay']">
                                At MicroFab, we have been serving the Pharmaceutical, Cosmetic, Food, and the Chemical industry across the years. Our adept and motivated team of professionals, along with the state-of-the-art engineering facilities, undertake designing, manufacturing, and delivering machinery to meet the requirements of our esteemed clients.
                            </p>
                        </center>
                    </div>
                </div>
            </center>

            <br></br>

            <div className="lg:flex z-2 flex-rows md:flex flex-cols overflow-x-scroll sm:flex flex-cols sm:-mt-6 animate__animated animate__fadeInRight animate__delay-1s">
                {categories.map((category) => (
                    <div key={category.id} className="relative p-2 m-auto mb-10">
                        <div
                            className={`md:w-[230px] w-full flex flex-col shadow-lg rounded-[20px]`}
                        >
                            <div className="flex flex-col items-center md:h-[190px] w-full">
                                <Link to={category.link}>
                                    <img
                                        className="w-48 h-40 p-2 object-cover"
                                        src={category.image}
                                        alt=""
                                    />
                                    <p className="text-center text-[#8AA6AA]">{category.title}</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isAddingNewCard && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md">
                    <form className="relative">
                        <button
                            onClick={() => {
                                clearInputFields();
                                setIsAddingNewCard(false);
                            }}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer absolute right-0 top-0"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFileInput(e.target.files[0])}
                        />

                        <input
                            type="text"
                            placeholder="Title"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Link"
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Order"
                            value={orderInput}
                            onChange={(e) => setOrderInput(e.target.value)}
                        />

                        <button
                            type="button"
                            onClick={handleAddNewCard}
                            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md"
                        >
                            Add New Card
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
