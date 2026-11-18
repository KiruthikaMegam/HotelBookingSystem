
import { createContext, useContext, useEffect, useState } from "react";
import {
  initialRooms,
  initialBookings
} from "../data/hotelData";

const HotelContext = createContext();

const emptyCustomer = {
  id: null,
  name: "",
  email: "",
  phone: "",
  address: ""
};

function loadData(key, defaultData) {
  try {
    const savedData = localStorage.getItem(key);

    if (savedData) {
      return JSON.parse(savedData);
    }

    return defaultData;
  } catch {
    return defaultData;
  }
}


function loadRooms() {
  const savedRooms = loadData("rrRooms", null);
  const roomDataVersion = localStorage.getItem("rrRoomsDataVersion");

  if (!Array.isArray(savedRooms)) {
    localStorage.setItem("rrRoomsDataVersion", "2");
    return initialRooms;
  }

  if (roomDataVersion !== "2") {
    const savedIds = savedRooms.map((room) => Number(room.id));
    const newRooms = initialRooms.filter(
      (room) => Number(room.id) >= 9 && !savedIds.includes(Number(room.id))
    );
    const updatedRooms = [...savedRooms, ...newRooms];

    localStorage.setItem("rrRooms", JSON.stringify(updatedRooms));
    localStorage.setItem("rrRoomsDataVersion", "2");

    return updatedRooms;
  }

  return savedRooms.map((room) => {
    const defaultRoom = initialRooms.find(
      (item) => Number(item.id) === Number(room.id)
    );
    const savedPrice = Number(room.price);
    const savedOriginalPrice = Number(room.originalPrice);
    const savedCapacity = Number(room.capacity);

    return {
      ...room,
      price:
        room.price !== null && Number.isFinite(savedPrice)
          ? savedPrice
          : room.originalPrice !== null && Number.isFinite(savedOriginalPrice)
            ? savedOriginalPrice
            : defaultRoom?.price || 0,
      originalPrice:
        room.originalPrice !== null && Number.isFinite(savedOriginalPrice)
          ? savedOriginalPrice
          : defaultRoom?.originalPrice || defaultRoom?.price || savedPrice || 0,
      capacity:
        room.capacity !== null && Number.isFinite(savedCapacity)
          ? savedCapacity
          : defaultRoom?.capacity || 2
    };
  });
}

function loadBookings() {
  const savedBookings = loadData("rrBookings", null);
  const bookingDataVersion = localStorage.getItem("rrBookingsDataVersion");

  let bookingsData = [];

  if (!Array.isArray(savedBookings)) {
    bookingsData = initialBookings;
  } else {
    bookingsData = [...savedBookings];

    if (bookingDataVersion !== "2") {
      const savedIds = bookingsData.map((booking) =>
        String(booking.id)
      );

      const demoBookings = initialBookings.filter(
        (booking) => !savedIds.includes(String(booking.id))
      );

      bookingsData = [...bookingsData, ...demoBookings];
    }
  }

  const updatedBookings = bookingsData.map((booking) => {
    const guest = booking.guest || {};

    const guestName =
      booking.guestName ||
      booking.customerName ||
      guest.name ||
      "Guest";

    const guestEmail =
      booking.email ||
      booking.customerEmail ||
      guest.email ||
      "";

    const guestPhone =
      booking.phone ||
      booking.customerPhone ||
      guest.phone ||
      "";

    const guestAddress =
      booking.address ||
      guest.address ||
      "";

    const bookingStatus =
      booking.bookingStatus ||
      booking.status ||
      "Pending";

    const paymentStatus =
      booking.paymentStatus ||
      "Pending";

    const totalPrice = Number(
      booking.totalPrice ??
      booking.totalAmount ??
      0
    );

    return {
      ...booking,

      guestName,
      email: guestEmail,
      phone: guestPhone,
      address: guestAddress,

      guest: {
        ...guest,
        name: guestName,
        email: guestEmail,
        phone: guestPhone,
        address: guestAddress
      },

      status: bookingStatus,
      bookingStatus,

      paymentStatus,

      totalPrice,
      totalAmount: totalPrice,

      roomName:
        booking.roomName ||
        booking.room?.name ||
        "Room",

      roomId:
        booking.roomId ||
        booking.room?.id ||
        null
    };
  });

  localStorage.setItem(
    "rrBookings",
    JSON.stringify(updatedBookings)
  );

  localStorage.setItem(
    "rrBookingsDataVersion",
    "2"
  );

  return updatedBookings;
}

function loadCustomers() {
  const savedCustomers = loadData("rrCustomers", null);

  if (Array.isArray(savedCustomers)) {
    return savedCustomers;
  }

  // Migrate the previous single customer account if one exists.
  const oldAccount = loadData("rrCustomerAccount", null);
  const oldEmail = localStorage.getItem("rrCustomerLoginEmail");
  const oldPassword = localStorage.getItem("rrCustomerLoginPassword");

  if (oldAccount && oldEmail && oldPassword) {
    const migratedCustomer = {
      ...oldAccount,
      id: "customer-" + Date.now(),
      email: oldEmail.toLowerCase(),
      password: oldPassword
    };

    localStorage.setItem(
      "rrCustomers",
      JSON.stringify([migratedCustomer])
    );

    if (localStorage.getItem("rrCustomerLoggedIn") === "true") {
      localStorage.setItem(
        "rrCurrentCustomerId",
        migratedCustomer.id
      );
    }

    return [migratedCustomer];
  }

  return [];
}

function loadCurrentCustomerId(customers) {
  const savedId = localStorage.getItem("rrCurrentCustomerId");

  if (savedId && customers.some((item) => String(item.id) === savedId)) {
    return savedId;
  }

  // Support an older login session.
  if (localStorage.getItem("rrCustomerLoggedIn") === "true") {
    const oldEmail = localStorage.getItem("rrCustomerLoginEmail");

    const oldCustomer = customers.find(
      (item) => item.email === oldEmail
    );

    if (oldCustomer) {
      localStorage.setItem(
        "rrCurrentCustomerId",
        String(oldCustomer.id)
      );

      return String(oldCustomer.id);
    }
  }

  return null;
}

export function HotelProvider({ children }) {
  const [rooms, setRooms] = useState(() =>
    loadRooms()
  );

  const [bookings, setBookings] = useState(() =>
    loadBookings()
  );

  const [customers, setCustomers] = useState(() =>
    loadCustomers()
  );

  const [currentCustomerId, setCurrentCustomerId] = useState(() =>
    loadCurrentCustomerId(customers)
  );

  const [message, setMessage] = useState("");

  const customer =
    customers.find(
      (item) => String(item.id) === String(currentCustomerId)
    ) || { ...emptyCustomer };

  useEffect(() => {
    localStorage.setItem("rrRooms", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem("rrBookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("rrCustomers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    if (currentCustomerId) {
      localStorage.setItem(
        "rrCurrentCustomerId",
        String(currentCustomerId)
      );
      localStorage.setItem("rrCustomerLoggedIn", "true");
    } else {
      localStorage.removeItem("rrCurrentCustomerId");
      localStorage.removeItem("rrCustomerLoggedIn");
    }
  }, [currentCustomerId]);

  // Register a new customer.
  function registerCustomer(customerData) {
    const normalizedEmail = customerData.email.toLowerCase().trim();

    const existingCustomer = customers.find(
      (item) => item.email.toLowerCase() === normalizedEmail
    );

    if (existingCustomer) {
      return {
        success: false,
        message: "This email is already registered. Please login."
      };
    }

    const newCustomer = {
      ...customerData,
      id: "customer-" + Date.now(),
      email: normalizedEmail
    };

    setCustomers((previousCustomers) => [
      ...previousCustomers,
      newCustomer
    ]);

    // Registration creates the account but does not sign the customer in.

    return {
      success: true,
      customer: newCustomer
    };
  }

  // Login an existing customer.
  function loginCustomer(email, password) {
    const normalizedEmail = email.toLowerCase().trim();

    const foundCustomer = customers.find(
      (item) =>
        item.email.toLowerCase() === normalizedEmail &&
        item.password === password
    );

    if (!foundCustomer) {
      return {
        success: false,
        message: "Invalid email or password."
      };
    }

    setCurrentCustomerId(foundCustomer.id);

    localStorage.setItem(
      "rrCustomerLoggedIn",
      "true"
    );

    return {
      success: true,
      customer: foundCustomer
    };
  }

  // Logout only the current customer.
  function logoutCustomer() {
    setCurrentCustomerId(null);

    localStorage.removeItem("rrCurrentCustomerId");
    localStorage.removeItem("rrCustomerLoggedIn");
  }

  // Calculate number of nights.
  function calculateNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(checkIn + "T00:00:00");
    const end = new Date(checkOut + "T00:00:00");

    const difference = end - start;

    return Math.round(difference / (1000 * 60 * 60 * 24));
  }

  // Calculate total booking price.
  function calculateTotal(price, checkIn, checkOut) {
    const nights = calculateNights(checkIn, checkOut);

    return nights * Number(price);
  }

  // Check room availability.
  function isRoomAvailable(roomId, checkIn, checkOut) {
  const room = rooms.find(
    (item) => Number(item.id) === Number(roomId)
  );

  if (!room || !room.available) {
    return false;
  }

  const nights = calculateNights(checkIn, checkOut);

  if (nights <= 0) {
    return false;
  }

  const existingBooking = bookings.some((booking) => {
    const bookingStatus =
      booking.bookingStatus ||
      booking.status ||
      "Pending";

    if (
      Number(booking.roomId) !== Number(roomId) ||
      bookingStatus.toLowerCase() === "cancelled"
    ) {
      return false;
    }

    return (
      booking.checkIn < checkOut &&
      booking.checkOut > checkIn
    );
  });

  return !existingBooking;
}

  // Get available rooms.
  function getAvailableRooms(checkIn, checkOut, guests = 1) {
    return rooms.filter((room) => {
      return (
        room.capacity >= Number(guests) &&
        isRoomAvailable(room.id, checkIn, checkOut)
      );
    });
  }

  // Add new room.
  function addRoom(roomData) {
    const newRoom = {
      ...roomData,
      id: Date.now(),
      price: Number(roomData.price),
      originalPrice: Number(roomData.originalPrice || roomData.price),
      capacity: Number(roomData.capacity),
      rating: Number(roomData.rating || 5),
      reviews: Number(roomData.reviews || 0),
      available: true,
      featured: roomData.featured || false
    };

    setRooms((previousRooms) => [
      ...previousRooms,
      newRoom
    ]);

    setMessage("Room added successfully!");

    return newRoom;
  }

  // Update room.
  function updateRoom(id, updatedData) {
    setRooms((previousRooms) =>
      previousRooms.map((room) => {
        if (room.id !== Number(id)) {
          return room;
        }

        return {
          ...room,
          ...updatedData,
          price: updatedData.price !== undefined ? Number(updatedData.price) : room.price,
          originalPrice: updatedData.originalPrice !== undefined ? Number(updatedData.originalPrice) : room.originalPrice,
          capacity: updatedData.capacity !== undefined ? Number(updatedData.capacity) : room.capacity
        };
      })
    );

    setMessage("Room updated successfully!");
  }

  // Delete room.
  function deleteRoom(id) {
  const hasBooking = bookings.some((booking) => {
    const bookingStatus =
      booking.bookingStatus ||
      booking.status ||
      "Pending";

    return (
      Number(booking.roomId) === Number(id) &&
      bookingStatus.toLowerCase() !== "cancelled"
    );
  });

  if (hasBooking) {
    setMessage("Cannot delete a room with active bookings.");
    return false;
  }

  setRooms((previousRooms) =>
    previousRooms.filter(
      (room) => Number(room.id) !== Number(id)
    )
  );

  setMessage("Room deleted successfully!");

  return true;
}

  // Create new booking.
  function createBooking(bookingData) {
    const room = rooms.find(
      (item) => item.id === Number(bookingData.roomId)
    );

    if (!room) {
      setMessage("Room not found!");

      return {
        success: false,
        message: "Room not found!"
      };
    }

    const adults = Number(bookingData.adults);
    const children = Number(bookingData.children || 0);
    const guests = adults + children;

    const nights = calculateNights(
      bookingData.checkIn,
      bookingData.checkOut
    );

    if (nights <= 0) {
      setMessage("Please select valid booking dates.");

      return {
        success: false,
        message: "Please select valid booking dates."
      };
    }

    const today = new Date();

    const todayString =
      today.getFullYear() + "-" +
      String(today.getMonth() + 1).padStart(2, "0") + "-" +
      String(today.getDate()).padStart(2, "0");

    if (bookingData.checkIn < todayString) {
      setMessage("Check-in date cannot be in the past.");

      return {
        success: false,
        message: "Check-in date cannot be in the past."
      };
    }

    if (adults < 1 || children < 0 || guests > room.capacity) {
      setMessage("Invalid guest count for this room.");

      return {
        success: false,
        message: "Invalid guest count for this room."
      };
    }

    const guest = bookingData.guest || {};

    if (!guest.name || !guest.email || !guest.phone || !guest.address) {
      setMessage("Please complete all guest details.");

      return {
        success: false,
        message: "Please complete all guest details."
      };
    }

    if (
      !isRoomAvailable(
        room.id,
        bookingData.checkIn,
        bookingData.checkOut
      )
    ) {
      setMessage("Sorry! This room is not available for these dates.");

      return {
        success: false,
        message: "Sorry! This room is not available for these dates."
      };
    }

    const serviceFee = Number(bookingData.serviceFee || 0);

    const roomTotal = calculateTotal(
      room.price,
      bookingData.checkIn,
      bookingData.checkOut
    );

    const totalPrice = roomTotal + serviceFee;

    const newBooking = {
      id: "RR" + Date.now(),

      // Connect this booking to the signed-in customer.
      customerId: currentCustomerId || null,

      roomId: room.id,
      roomName: room.name,
      roomImage: room.image,
      roomType: room.type,
      pricePerNight: room.price,

      guestName: guest.name,
      email: guest.email,
      phone: guest.phone,
      address: guest.address,

      guest,

      adults,
      children,
      guests,

      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      nights,

      requests: bookingData.requests || "",

      roomTotal,
      serviceFee,
      totalPrice,

      status: "Confirmed",
      paymentStatus: "Pending",

      createdAt: new Date().toISOString()
    };

    setBookings((previousBookings) => [
      ...previousBookings,
      newBooking
    ]);

    setMessage("Booking confirmed successfully!");

    return {
      success: true,
      booking: newBooking
    };
  }

  // Cancel booking belonging to the current customer.
 function cancelBooking(bookingId) {
  const booking = bookings.find(
    (item) => String(item.id) === String(bookingId)
  );

  if (!booking) {
    setMessage("Booking not found!");
    return false;
  }

  const bookingCustomerId = booking.customerId;

  const bookingEmail =
    booking.email ||
    booking.customerEmail ||
    booking.guest?.email ||
    "";

  const currentCustomerEmail = customer.email || "";

  const matchesCustomerId =
    bookingCustomerId &&
    String(bookingCustomerId) === String(currentCustomerId);

  const matchesEmail =
    bookingEmail.toLowerCase() ===
    currentCustomerEmail.toLowerCase();

  if (!matchesCustomerId && !matchesEmail) {
    setMessage("You cannot cancel another customer's booking.");
    return false;
  }

  const currentStatus =
    booking.bookingStatus ||
    booking.status ||
    "Pending";

  if (currentStatus.toLowerCase() === "cancelled") {
    setMessage("This booking is already cancelled.");
    return false;
  }

  setBookings((previousBookings) =>
    previousBookings.map((item) =>
      String(item.id) === String(bookingId)
        ? {
            ...item,
            status: "Cancelled",
            bookingStatus: "Cancelled",
            cancelledAt: new Date().toISOString()
          }
        : item
    )
  );

  setMessage("Booking cancelled successfully!");

  return true;
}

  // Update booking status from admin.
  function updateBookingStatus(id, status) {
  setBookings((previousBookings) =>
    previousBookings.map((booking) =>
      String(booking.id) === String(id)
        ? {
            ...booking,
            status: status,
            bookingStatus: status
          }
        : booking
    )
  );

  setMessage("Booking status updated!");
}

  // Update payment status from admin.
  function updatePaymentStatus(id, paymentStatus) {
  setBookings((previousBookings) =>
    previousBookings.map((booking) =>
      String(booking.id) === String(id)
        ? {
            ...booking,
            paymentStatus: paymentStatus
          }
        : booking
    )
  );

  setMessage("Payment status updated!");
}

  // Update the currently logged-in customer's profile.
  function updateCustomer(updatedData) {
    if (!currentCustomerId) {
      setMessage("Please sign in to update your profile.");
      return false;
    }

    setCustomers((previousCustomers) =>
      previousCustomers.map((item) =>
        String(item.id) === String(currentCustomerId)
          ? {
            ...item,
            ...updatedData,
            id: item.id,
            password: item.password
          }
          : item
      )
    );

    setMessage("Profile updated successfully!");

    return true;
  }

  // Clear confirmation message.
  function clearMessage() {
    setMessage("");
  }

  const value = {
    rooms,
    bookings,
    customer,
    customers,
    currentCustomerId,
    message,

    setMessage,
    clearMessage,

    registerCustomer,
    loginCustomer,
    logoutCustomer,

    calculateNights,
    calculateTotal,
    isRoomAvailable,
    getAvailableRooms,

    addRoom,
    updateRoom,
    deleteRoom,

    createBooking,
    cancelBooking,
    updateBookingStatus,
    updatePaymentStatus,

    updateCustomer
  };

  return (
    <HotelContext.Provider value={value}>
      {children}
    </HotelContext.Provider>
  );
}

export function useHotel() {
  const context = useContext(HotelContext);

  if (!context) {
    throw new Error(
      "useHotel must be used inside HotelProvider"
    );
  }

  return context;
}
