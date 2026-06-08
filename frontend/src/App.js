import "./App.css";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FAQPage,
  ProductDetailsPage,
  ProfilePage,
  CheckoutPage,
  PaymentPage,
  OrderSuccessPage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  OrderDetailsPage,
  TrackOrderPage,
  UserInbox
} from "./routes/Routes.js";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { store } from "./redux/store.js";
import { LoadSeller, LoadUser } from "./redux/actions/user.js";
import { useSelector } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute.js";
import {ShopHomePage} from "./ShopRoutes.jsx"
import SellerProtectedRoute from "./routes/SellerProtectedRoute.js";
import {ShopDashboardPage,ShopCreateProduct,ShopAllProducts,ShopCreateEvents,ShopAllEvents,ShopAllCoupons,ShopPreviewPage,ShopAllOrders,ShopOrderDetails,ShopAllRefunds,ShopSettingsPage,ShopWithDrawMoneyPage,ShopInboxPage} from "./routes/ShopRoutes";
import Loader from "./components/Layout/Loader.jsx";
import { getAllProducts } from "./redux/actions/product.js";
import { getAllEvents } from "./redux/actions/event.js";
import axios from "axios";
import { server } from "./server.js";
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'

function App() {
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { isLoading, isSeller } = useSelector((state) => state.seller);
  const [stripeApiKey,setStripeKey]=useState("")
  async function getStripeApiKey() {
    const {data}=await axios.get(`${server}/payment/getstripeapikey`) 
    setStripeKey(data.stripeApiKey)
    
  }
  useEffect(() => {
    store.dispatch(LoadUser());
    store.dispatch(LoadSeller())
    store.dispatch(getAllProducts())
    store.dispatch(getAllEvents())
    getStripeApiKey()
  }, []);
  
  return (
    <>
      {loading || isLoading ? (<Loader/>) : (
        <BrowserRouter>
        {stripeApiKey &&  (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Routes>
              <Route
              path="/payment" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PaymentPage/>
              </ProtectedRoute>
              }/>
            </Routes>
          </Elements>
        )}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route
              path="/activation/user/:activation_token"
              element={<ActivationPage />}
            />
            <Route
              path="/seller/activation/:activation_token"
              element={<SellerActivationPage />}
            />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/best-selling" element={<BestSellingPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/faq" element={<FAQPage />} />
              


            <Route
              path="/profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/inbox"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <UserInbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/conversation/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <UserInbox />
                </ProtectedRoute>
              }
            />
             <Route
              path="/user/order/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <OrderDetailsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/track/order/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <TrackOrderPage />
                </ProtectedRoute>
              }
            />


            <Route
              path="/checkout"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CheckoutPage />
                </ProtectedRoute>
              }

            /> 
            
            <Route path="/order/success" element={<OrderSuccessPage />} />

            <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />

            {/* shop routes */}
            <Route path="/shop-create" element={<ShopCreatePage />} />
            <Route path="/shop-login" element={<ShopLoginPage />} />
            <Route path="/shop/:id" element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopHomePage />
              </SellerProtectedRoute>
              
            } />

            <Route path="/settings" element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopSettingsPage />
              </SellerProtectedRoute>
              
            } />

            <Route
          path="/dashboard"
          element={
            <SellerProtectedRoute isSeller={isSeller}>
              <ShopDashboardPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <SellerProtectedRoute isSeller={isSeller}>
              <ShopCreateProduct />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-orders"
          element={
            <SellerProtectedRoute isSeller={isSeller}>
              <ShopAllOrders />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-refunds"
          element={
            <SellerProtectedRoute isSeller={isSeller}>
              <ShopAllRefunds />
            </SellerProtectedRoute>
          }
        />

         <Route
          path="/order/:id"
          element={
            <SellerProtectedRoute isSeller={isSeller}>
              <ShopOrderDetails />
            </SellerProtectedRoute>
          }
        />
        
        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRoute isSeller={isSeller}>
              <ShopAllProducts />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-create-event"
          element={
            <SellerProtectedRoute isSeller={isSeller} >
              <ShopCreateEvents />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-events"
          element={
            <SellerProtectedRoute isSeller={isSeller}>
              <ShopAllEvents />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-coupons"
          element={
            <SellerProtectedRoute isSeller={isSeller}>
              <ShopAllCoupons />
            </SellerProtectedRoute>
          }
        />

        <Route
          path="/dashboard-withdraw-money"
          element={
            <SellerProtectedRoute isSeller={isSeller}>
              <ShopWithDrawMoneyPage />
            </SellerProtectedRoute>
          }
        />
        <Route
          path="/dashboard-messages"
          element={
            <SellerProtectedRoute isSeller={isSeller}>
              <ShopInboxPage />
            </SellerProtectedRoute>
          }
        />
        
          </Routes>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
