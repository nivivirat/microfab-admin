import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../../../firebase';

export default function SocialMedia() {
    const [socialMediaLinks, setSocialMediaLinks] = useState({
        linkedin: '',
        instagram: '',
        youtube: '',
        facebook: '',
    });

    const [socialMediaData, setSocialMediaData] = useState([]);
    const [editedLinks, setEditedLinks] = useState({});

    useEffect(() => {
        const dataRef = ref(db, 'SocialMediaLinks');
        onValue(dataRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setSocialMediaData(Object.entries(data));
                setSocialMediaLinks(data);
            }
        });
    }, []);

    const handleLinkChange = (platform, link) => {
        setEditedLinks((prevLinks) => ({
            ...prevLinks,
            [platform]: link,
        }));
    };

    const saveLinksToFirebase = () => {
        const updatedLinks = { ...socialMediaLinks, ...editedLinks };
        set(ref(db, 'SocialMediaLinks'), updatedLinks, (error) => {
            if (error) {
                console.error('Error updating social media links:', error);
            } else {
                console.log('Social media links updated successfully');
            }
        });
        setEditedLinks({});
    };

    const handleLinkClick = (link) => {
        window.open(link, '_blank');
    };

    return (
        <div className="max-w-screen-lg mx-auto p-4">
            <table className="table-auto w-full border border-collapse text-center">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="py-2 px-4 border">Platform</th>
                        <th className="py-2 px-4 border">Social Media Icon</th>
                        <th className="py-2 px-4 border">Link</th>
                    </tr>
                </thead>
                <tbody>
                    {socialMediaData.map(([platform, content], index) => (
                        <tr key={index} className="bg-gray-100">
                            <td className="py-2 px-4 border">{platform}</td>
                            <td className="py-2 px-4 border">
                                <Icon
                                    icon={`mdi:${platform}`}
                                    className="border-2 border-primary bg-primary text-white rounded-full h-10 p-2 w-10 cursor-pointer"
                                    onClick={() => handleLinkClick(editedLinks[platform] || content)}
                                />
                            </td>
                            <td className="py-2 px-4 border">
                                <input
                                    type="text"
                                    className="w-full bg-gray-100"
                                    value={editedLinks[platform] !== undefined ? editedLinks[platform] : content}
                                    onChange={(e) => handleLinkChange(platform, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4 md:flex md:flex-row flex flex-row md:place-items-start place-items-center md:gap-2 gap-2">
                {Object.entries(socialMediaLinks).map(([platform, link]) => (
                    <div key={platform} className="mb-2">
                        <input
                            type="text"
                            placeholder={`${platform} Link`}
                            value={editedLinks[platform] !== undefined ? editedLinks[platform] : link}
                            onChange={(e) => handleLinkChange(platform, e.target.value)}
                            className="border p-2"
                        />
                        <a
                            href={editedLinks[platform] || link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="md:ml-2"
                        >
                            <Icon
                                icon={`mdi:${platform}`}
                                className="border-2 border-white text-primary rounded-full h-10 p-2 w-10 cursor-pointer"
                                onClick={() => handleLinkClick(editedLinks[platform] || link)}
                            />
                        </a>
                    </div>
                ))}
            </div>

            <button
                onClick={saveLinksToFirebase}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
                Save Links
            </button>
        </div>
    );
}
