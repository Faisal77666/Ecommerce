import { createReducer, createAction } from '@reduxjs/toolkit'

// Actions
export const eventCreateRequest = createAction("eventCreateRequest");
export const eventCreateSuccess = createAction("eventCreateSuccess");
export const eventCreateFail = createAction("eventCreateFail");
export const getAllEventsShopRequest = createAction("getAllEventsShopRequest");
export const getAllEventsShopSuccess = createAction("getAllEventsShopSuccess");
export const getAllEventsShopFail = createAction("getAllEventsShopFail");
export const deleteEventRequest = createAction("deleteEventRequest");
export const deleteEventSuccess = createAction("deleteEventSuccess");
export const deleteEventFail = createAction("deleteEventFail");
export const getAllEventsRequest = createAction("getAllEventsRequest");
export const getAllEventsSuccess = createAction("getAllEventsSuccess");
export const getAllEventsFail = createAction("getAllEventsFail");
export const clearErrors = createAction("clearErrors");
export const cleareventSuccess = createAction("cleareventSuccess"); // ✅ NEW ACTION

// Initial State
const initialState = {
  isLoading: true,
};

// Reducer
export const eventReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(eventCreateRequest, (state) => {
      state.isLoading = true;
    })
    .addCase(eventCreateSuccess, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.events = action.payload;
    })
    .addCase(eventCreateFail, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
     //get all events of shop
    .addCase(getAllEventsShopRequest,(state)=>{
      state.isLoading=true;
    })
    .addCase(getAllEventsShopSuccess, (state, action) => {
  state.isLoading = false;
  state.events = action.payload; // ✅ store events correctly
})
.addCase(getAllEventsShopFail, (state, action) => {
  state.isLoading = false;
  state.error = action.payload; // ✅ store error
})
// delete event
    .addCase(deleteEventRequest,(state)=>{
      state.isLoading=true;
    })
    .addCase(deleteEventSuccess, (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
    })
    .addCase(deleteEventFail, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    //get all events
    .addCase(getAllEventsRequest,(state)=>{
      state.isLoading=true;
    })
    .addCase(getAllEventsSuccess, (state, action) => {
  state.isLoading = false;
  state.allEvents = action.payload; // ✅ store events correctly
})
.addCase(getAllEventsFail, (state, action) => {
  state.isLoading = false;
  state.error = action.payload; // ✅ store error
})

    .addCase(clearErrors, (state) => {
      state.error = null;
    })
    .addCase(cleareventSuccess, (state) => {
      state.success = false; // ✅ reset success flag
    });
});
