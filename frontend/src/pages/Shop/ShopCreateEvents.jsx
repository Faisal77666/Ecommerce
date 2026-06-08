import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSidebar";
import CreateEvent from "../../components/Shop/CreateEvent.jsx";

const ShopCreateEvents = () => {
  return (
    <div> {/* 👈 Added top margin here */}
      <DashboardHeader />
      <div className="w-full flex justify-between mt-6"> {/* 👈 Added some margin below header */}
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSidebar active={6} />
        </div>
        <div className="w-full flex justify-center">
          <CreateEvent />
        </div>
      </div>
    </div>
  );
};

export default ShopCreateEvents;
