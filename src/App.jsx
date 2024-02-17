import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './Components/Sidebar/Sidebar';
import Home from './Components/Home/Home';
import ContactUs from './Components/ContactUs/ContactUs';
import AboutUs from './Components/AboutUs/AboutUs';
import SocialMedia from './Components/SocialMedia/SocialMedia';

function App() {
  return (
    <BrowserRouter>
      <div className="font-poppins w-screen overflow-clip no-vertical-scroll">

        <SideBar />

        <div className="ml-[50px] mt-[80px]">
          <Routes>
            {/* <Route path="/media/:id/:heading" element={<SingleFileUpload />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/SocialMedia" element={<SocialMedia />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;