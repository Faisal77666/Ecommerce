import { configureStore } from '@reduxjs/toolkit'
import {userReducer} from "./reducers/user.js"
import {sellerReducer} from "./reducers/seller.js"
import {productReducer} from './reducers/product.js'
import { eventReducer } from './reducers/event.js';
import { cartReducer } from './reducers/cart.js';
import { wishlistReducer } from './reducers/wishlist.js';
import { orderReducer } from './reducers/order.js';


export const store = configureStore({
  reducer: {
    user:userReducer,
    seller:sellerReducer,
    products:productReducer,
    events:eventReducer,
    cart:cartReducer,
    wishlist:wishlistReducer,
    order:orderReducer,
  },
  // ✅ only if you are customizing middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});