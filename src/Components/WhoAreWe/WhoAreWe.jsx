import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { ref, update, onValue } from "firebase/database";

const Section = ({ id, title, description, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title || "");
  const [editedDescription, setEditedDescription] = useState(description || "");

  const handleEdit = () => {
    setEditing(true);
    onEdit(id);
  };

  const handleSave = async () => {
    // Update the content in the database
    try {
      await update(ref(db, `Home/Who_Are_We/${id}`), {
        title: editedTitle,
        description: editedDescription,
      });
      console.log("Content saved to the database:", editedTitle, editedDescription);
    } catch (error) {
      console.error("Error saving data:", error.message);
    }

    // Reset the editing state
    setEditing(false);
  };

  return (
    <div className="flex-shrink-0 w-[50%] flex flex-row gap-5">
      <div className="block md:w-[5px] w-[10px] h-[100px] md:h-[120px] bg-[#8AA6AA] gap-1"></div>
      <div className="md:w-[75%] md:text-[16px] flex flex-col">
        {editing ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="md:text-[20px] font-semibold text-[18px] overflow-visible"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows="4"
            ></textarea>
            <button onClick={handleSave} className="bg-blue-500 text-white p-2">
              Save
            </button>
          </>
        ) : (
          <>
            <p className="md:text-[20px] font-semibold text-[18px] overflow-visible">
              {title}
            </p>
            <p className="md:w-full w-[60%]">{description}</p>
            <button onClick={handleEdit} className="bg-primary rounded-xl text-white p-2">
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default function Who_are_we() {
  const [sectionsData, setSectionsData] = useState([]);
  const [content, setContent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    const fetchData = () => {
      const sectionRef = ref(db, "Home/Who_Are_We");
      const contentRef = ref(db, "Home/Who_Are_We_Text");

      const onSectionValue = onValue(sectionRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setSectionsData(data);
        } else {
          console.log("No section data available");
        }
      });

      const onContentValue = onValue(contentRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setContent(data);
          setEditedContent(data.content);
        } else {
          console.log("No content data available !");
        }
      });

      // Cleanup function
      return () => {
        // Unsubscribe from the onValue listeners when the component unmounts
        onSectionValue();
        onContentValue();
      };
    };
    fetchData();
  }, []);

  const handleSectionEdit = (id) => {
    // Implement any logic you need when a section is being edited
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    // Update the content in the database
    try {
      await update(ref(db, "Home/Who_Are_We_Text"), {
        content: editedContent,
      });
      console.log("Content saved to the database:", editedContent);
    } catch (error) {
      console.error("Error saving data:", error.message);
    }

    // Reset the editing state
    setEditing(false);
  };

  return (
    <div className="custom-font flex md:flex-col md:justify-between">
      <div className="text-center p-4">
        <p className="md:text-[35px] text-[35px] font-bold">Who Are We?</p>
        {editing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="4"
            className="w-full md:w-[80%] p-2 mb-2 border border-gray-300 rounded"
          ></textarea>
        ) : (
          <p className="md:text-[16px] md:w-[100%]">
            {content ? content.content : "Loading..."}
          </p>
        )}
        {editing ? (
          <button onClick={handleSave} className="bg-blue-500 rounded-xl mt-10 text-white p-2">
            Save
          </button>
        ) : (
          <button onClick={handleEdit} className="bg-primary rounded-xl mt-5 w-[140px] text-white p-2">
            Edit
          </button>
        )}
      </div>
      <div className="w-full flex md:flex-col md:p-10 p-4 flex-col">
        {/* desktop view */}
        <div className="md:flex hidden md:flex-col overflow-x-auto md:justify-start md:gap-20">
          {/* 21 countries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:mt-10">
            {sectionsData.map((section, index) => (
              <Section
                key={index}
                id={index} // You can use a more unique identifier if available
                title={section.title}
                description={section.description}
                onEdit={handleSectionEdit}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
