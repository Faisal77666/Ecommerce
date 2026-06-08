import React from "react";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { MdOutlineLocalOffer } from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

function DashboardSidebar({ active }) {
  return (
    <div className="w-full h-[89vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {/* single item */}
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard" className="w-full flex items-center">
          <RxDashboard
            color={`${active === 1 ? "#006400" : "#555"}`}
            size={30}
          />
          <h5
            className={`pl-2 text-[18px] font-[400] ${
              active === 1 ? "text-[#006400]" : "text-[#555]"
            } 800px:block hidden `}
          >
            Dashboard
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-orders" className="w-full flex items-center">
          <FiShoppingBag
            color={`${active === 2 ? "#006400" : "#555"}`}
            size={30}
          />
          <h5
            className={`pl-2 text-[18px] font-[400] ${
              active === 2 ? "text-[#006400]" : "text-[#555]"
            } 800px:block hidden`}
          >
            All Orders
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-products" className="w-full flex items-center">
          <FiPackage color={`${active === 3 ? "#006400" : "#555"}`} size={30} />
          <h5
            className={`pl-2 text-[18px] font-[400] ${
              active === 3 ? "text-[#006400]" : "text-[#555]"
            } 800px:block hidden`}
          >
            All Products
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link
          to="/dashboard-create-product"
          className="w-full flex items-center"
        >
          <AiOutlineFolderAdd
            color={`${active === 4 ? "#006400" : "#555"}`}
            size={30}
          />
          <h5
            className={`pl-2 text-[18px] font-[400] ${
              active === 4 ? "text-[#006400]" : "text-[#555]"
            } 800px:block hidden`}
          >
            Create Products
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-events" className="w-full flex items-center">
          <MdOutlineLocalOffer
            color={`${active === 5 ? "#006400" : "#555"}`}
            size={30}
          />
          <h5
            className={`pl-2 text-[18px] font-[400] ${
              active === 5 ? "text-[#006400]" : "text-[#555]"
            } 800px:block hidden`}
          >
            All Events
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-create-event" className="w-full flex items-center">
          <VscNewFile
            color={`${active === 6 ? "#006400" : "#555"}`}
            size={30}
          />
          <h5
            className={`pl-2 text-[18px] font-[400] ${
              active === 6 ? "text-[#006400]" : "text-[#555]"
            } 800px:block hidden`}
          >
            Create Event
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link
          to="/dashboard-withdraw-money"
          className="w-full flex items-center"
        >
          <CiMoneyBill
            color={`${active === 7 ? "#006400" : "#555"}`}
            size={30}
          />
          <h5
            className={`pl-2 text-[18px] font-[400] ${
              active === 7 ? "text-[#006400]" : "text-[#555]"
            } 800px:block hidden`}
          >
            Withdraw Money
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-messages" className="w-full flex items-center">
          <BiMessageSquareDetail
            color={`${active === 8 ? "#006400" : "#555"}`}
            size={30}
          />
          <h5
            className={`pl-2 text-[18px] font-[400] ${
              active === 8 ? "text-[#006400]" : "text-[#555]"
            } 800px:block hidden`}
          >
            Shop Inbox
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-coupons" className="w-full flex items-center">
          <AiOutlineGift
            color={`${active === 9 ? "#006400" : "#555"}`}
            size={30}
          />
          <h5
            className={`pl-2 text-[18px] font-[400] ${
              active === 9 ? "text-[#006400]" : "text-[#555]"
            } 800px:block hidden`}
          >
            Discount Codes
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/dashboard-refunds" className="w-full flex items-center">
          <HiOutlineReceiptRefund
            color={`${active === 10 ? "#006400" : "#555"}`}
            size={30}
          />
          <h5
            className={`pl-2 text-[18px] font-[400] ${
              active === 10 ? "text-[#006400]" : "text-[#555]"
            } 800px:block hidden`}
          >
            Refunds
          </h5>
        </Link>
      </div>
      <div className="w-full flex items-center p-4">
        <Link to="/settings" className="w-full flex items-center">
          <CiSettings
            color={`${active === 11 ? "#006400" : "#555"}`}
            size={30}
          />
          <h5
            className={`pl-2 text-[18px] font-[400] ${
              active === 11 ? "text-[#006400]" : "text-[#555]"
            } 800px:block hidden`}
          >
            Settings
          </h5>
        </Link>
      </div>
    </div>
  );
}

export default DashboardSidebar;
