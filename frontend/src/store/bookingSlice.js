import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentBooking: {
    pickup: '',
    drop: '',
    bookingType: 'One-Way Taxi',
    dateTime: '',
    returnDateTime: '',
    passengers: 1,
    vehicleCategory: 'Sedan',
    customerDetails: {
      name: '',
      email: '',
      phone: '',
      secondaryPhone: ''
    },
    estimatedFare: 0,
    distance: '0 km',
    paymentStatus: 'Pending',
    paymentId: ''
  },
  step: 1,
  activeBookingList: [],
  loading: false,
  error: null
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    updateBookingForm: (state, action) => {
      state.currentBooking = {
        ...state.currentBooking,
        ...action.payload
      };
    },
    updateCustomerDetails: (state, action) => {
      state.currentBooking.customerDetails = {
        ...state.currentBooking.customerDetails,
        ...action.payload
      };
    },
    setBookingStep: (state, action) => {
      state.step = action.payload;
    },
    resetBookingForm: (state) => {
      state.currentBooking = initialState.currentBooking;
      state.step = 1;
    },
    setBookingList: (state, action) => {
      state.activeBookingList = action.payload;
    }
  }
});

export const { updateBookingForm, updateCustomerDetails, setBookingStep, resetBookingForm, setBookingList } = bookingSlice.actions;
export default bookingSlice.reducer;
