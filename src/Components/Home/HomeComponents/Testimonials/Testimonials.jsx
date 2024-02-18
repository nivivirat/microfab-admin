import React, { useState, useEffect } from 'react';
import { ref, onValue, set, push } from 'firebase/database';
import { db } from '../../../../../firebase';
import { v4 as uuidv4 } from 'uuid';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [newTestimonial, setNewTestimonial] = useState({
        content: '',
        author: '',
        company: '',
    });

    const [deletionUid, setDeletionUid] = useState(null);
    const [isFormVisible, setFormVisible] = useState(false);

    useEffect(() => {
        const testimonialsRef = ref(db, 'Home/Testimonials');
        onValue(testimonialsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Convert testimonials object into an array of objects
                const testimonialArray = Object.entries(data).map(([key, value]) => ({ ...value, uid: key }));
                // Sort testimonials by timestamp in descending order
                testimonialArray.sort((a, b) => b.timestamp - a.timestamp);
                setTestimonials(testimonialArray);
            }
        });
    }, [deletionUid]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTestimonial((prevTestimonial) => ({
            ...prevTestimonial,
            [name]: value,
        }));
    };

    const handleAddTestimonial = () => {
        const uid = uuidv4();
        const timestamp = Date.now();
        const testimonialData = { ...newTestimonial, timestamp };
        // Use push to generate a new unique key and store testimonial data
        push(ref(db, 'Home/Testimonials'), testimonialData);
        setNewTestimonial({ content: '', author: '', company: '' });
        setFormVisible(false);
    };

    const handleEditTestimonial = (uid, updatedTestimonial) => {
        set(ref(db, `Home/Testimonials/${uid}`), updatedTestimonial);
    };

    const handleDeleteTestimonial = (uid) => {
        setDeletionUid(uid);
    };

    const confirmDeletion = () => {
        if (deletionUid) {
            set(ref(db, `Home/Testimonials/${deletionUid}`), null);
            setDeletionUid(null);
        }

        alert("Refresh the page to load the updated testimonials");
    };

    return (
        <div className='px-10 border border-primary rounded-lg p-10 flex flex-col relative'>
            <h2 className="text-2xl font-bold mb-4">Testimonials</h2>

            <button
                onClick={() => setFormVisible(true)}
                className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded"
            >
                Add Testimonial
            </button>

            {testimonials.map(({ uid, content, author, company }) => (
                <div key={uid} className="mb-4 border rounded-md p-4">
                    <p className="text-lg">{content}</p>
                    <p className="mt-2 text-sm">- {author}, {company}</p>
                    <div className="flex gap-2 mt-2">
                        <button onClick={() => handleEditTestimonial(uid, /* updated testimonial object */)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                        <button onClick={() => handleDeleteTestimonial(uid)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                </div>
            ))}

            {deletionUid && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white p-4 rounded">
                        <p>Are you sure you want to delete this testimonial?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={confirmDeletion} className="bg-red-500 text-white px-4 py-2 rounded mr-2">Yes</button>
                            <button onClick={() => setDeletionUid(null)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isFormVisible && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-md w-96">
                    <div className="flex justify-end">
                        <button onClick={() => setFormVisible(false)} className="text-xl font-bold">&times;</button>
                    </div>
                    <form className="flex flex-col gap-4">
                        <label className="mb-2">
                            <span className="block text-gray-600">Content:</span>
                            <textarea name="content" value={newTestimonial.content} onChange={handleInputChange} className="border p-2 w-full"></textarea>
                        </label>
                        <label className="mb-2">
                            <span className="block text-gray-600">Author:</span>
                            <input type="text" name="author" value={newTestimonial.author} onChange={handleInputChange} className="border p-2 w-full" />
                        </label>
                        <label className="mb-4">
                            <span className="block text-gray-600">Company:</span>
                            <input type="text" name="company" value={newTestimonial.company} onChange={handleInputChange} className="border p-2 w-full" />
                        </label>
                        <button type="button" onClick={handleAddTestimonial} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 ease-in-out">Add Testimonial</button>
                    </form>
                </div>
            )}
        </div>
    );
}
