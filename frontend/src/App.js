// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import ResidentHome from "./components/ResidentHome";
import CommitteeHome from "./components/CommitteeHome";
import Pets from "./components/Pets";
import Helpers from "./components/Helpers";
import Residents from "./components/Residents";
import DailyHelp from "./components/DailyHelp";
import Family from "./components/Family";
import Reminders from "./components/Reminders";
// import AddVehicle from "./components/AddVehicle";
// import ViewVehicle from "./components/ViewVehicle";
// import RemoveVehicle from "./components/RemoveVehicle";
// import Vehicles from "./components/Vehicles";
import LandingPage from "./components/LandingPage";
import CommitteeHouseHold from "./components/CommitteeHouseHold";
import Profile from "./components/Profile";
import Vehicles from "./components/Vehicles";
import Noticeboard from "./components/Noticeboard";
import Bills from "./components/Bills";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/resident_home" element={<ResidentHome />} />
        <Route path="/committee_home" element={<CommitteeHome />} />
        <Route path="/pets" element={<Pets />} />
        <Route path="/helpers" element={<Helpers />} />
        <Route path="/landing_page" element={<LandingPage />} />
        <Route path="/committee_household" element={<CommitteeHouseHold />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/noticeboard" element={<Noticeboard />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/daily_help" element={<DailyHelp />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/family" element={<Family />} />
        <Route path="/reminders" element={<Reminders />} />
      </Routes>
    </Router>
  );
};

export default App;
