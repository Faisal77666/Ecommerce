import axios from "axios";
import { server } from "../../server";
import {
  eventCreateRequest,
  eventCreateSuccess,
  eventCreateFail,
   getAllEventsShopRequest,
   getAllEventsShopFail,
   getAllEventsShopSuccess,
   deleteEventFail,
   deleteEventRequest,
   deleteEventSuccess,
   getAllEventsRequest,
   getAllEventsSuccess,
   getAllEventsFail
} from "../reducers/event"; // adjust path

// create event
export const createevent = (newForm) => async (dispatch) => {
  try {
    dispatch(eventCreateRequest());

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post(
      `${server}/event/create-event`,
      newForm,
      config
    );

    dispatch(eventCreateSuccess(data.events));
  } catch (error) {
    dispatch(
      eventCreateFail(error.response?.data?.message || error.message)
    );
  }
};


//get all events of shop
export const getAllEventsShop=(id)=>async(dispatch)=>{
  try {
    dispatch(getAllEventsShopRequest());
     const { data } = await axios.get(
      `${server}/event/get-all-events/${id}`)
      dispatch(getAllEventsShopSuccess(data.events))
     
    
  } catch (error) {
    dispatch(
      getAllEventsShopFail(error.response?.data?.message || error.message)
    );
  }

}
//delete event of a shop

export const deleteEvent=(id)=>async (dispatch) => {
  try {
    dispatch(deleteEventRequest())
    const { data } = await axios.delete(
      `${server}/Event/delete-shop-Event/${id}`,{withCredentials:true})
      dispatch(deleteEventSuccess(data.message))
    
  } catch (error) {
    dispatch(
      deleteEventFail(error.response?.data?.message || error.message)
    );
  }
  
}
//get all events
export const getAllEvents=(id)=>async(dispatch)=>{
  try {
    dispatch(getAllEventsRequest());
     const { data } = await axios.get(
      `${server}/event/get-all-events`)
      dispatch(getAllEventsSuccess(data.events))
     
    
  } catch (error) {
    dispatch(
      getAllEventsFail(error.response?.data?.message || error.message)
    );
  }

}
