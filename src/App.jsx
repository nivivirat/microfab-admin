import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './Components/Sidebar/Sidebar';
import Home from './Components/Home/Home';
import ContactUs from './Components/ContactUs/ContactUs';
import AboutUs from './Components/AboutUs/AboutUs';
import SocialMedia from './Components/SocialMedia/SocialMedia';
import Testimonials from './Components/Home/HomeComponents/Testimonials/Testimonials';
import ManufacturingPage from './Components/ManufacturingPage/ManufacturingPage';
import QueryForm from './Components/QueryForm/QueryForm';
import Who_are_we from './Components/WhoAreWe/WhoAreWe';
import Analytics from './Components/Home/HomeComponents/Analytics/Analytics';
import TurnKey from './Components/Home/HomeComponents/Turnkey/Turnkey';

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
            <Route path="/Testimonials" element={<Testimonials />} />
            <Route path="/ManufacturingPage" element={<ManufacturingPage />} />
            <Route path="/QueryForm" element={<QueryForm />} />
            <Route path="/WhoAreWe" element={<Who_are_we />} />
            <Route path="/Analytics" element={<Analytics />} />
            <Route path="/HomeTurnKey" element={<TurnKey />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;