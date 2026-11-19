import { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
const API_URL = "http://localhost:8080/SmartBusBackend";

/* =========================================================
   CITY DATA
========================================================= */

const cities = [
  "Bengaluru",
  "Bangalore",
  "Mysuru",
  "Mangalore",
  "Mangaluru",
  "Udupi",
  "Madikeri",
  "Hassan",
  "Mandya",
  "Tumakuru",
  "Chitradurga",
  "Davangere",
  "Shivamogga",
  "Hubballi",
  "Dharwad",
  "Gadag",
  "Haveri",
  "Belagavi",
  "Bagalkot",
  "Vijayapura",
  "Ballari",
  "Bellary",
  "Hospet",
  "Hosapete",
  "Koppal",
  "Raichur",
  "Yadgir",
  "Kalaburagi",
  "Gulbarga",
  "Bidar",
  "Koppal",
  "Sirsi",
  "Karwar",
  "Chikkamagaluru",
  "Kolar",
  "Chikkaballapur",
  "Ramanagara",
  "Chamarajanagar",
  "Kundapura",
  "Bhadravati",
  "Harihar",
  "Ranebennur",
  "Doddaballapur",
  "Channapatna",
  "Hospet",
  "Gangavathi",
  "Ilkal",
  "Mudhol",
  "Jamkhandi",
  "Athani",
  "Gokak",
  "Sankeshwar",
  "Sedam",
  "Aland",
  "Jewargi",
  "Shahapur",
  "Manvi",
  "Sindhanur",
  "Lingsugur",
  "Basavakalyan",
  "Bhalki",
  "Humnabad"
];

/* =========================================================
   CITY NORMALIZATION
========================================================= */

function normalizeCity(city) {
  if (!city) return "";

  const value = city.toLowerCase().trim();

  if (value === "bangalore") return "bengaluru";
  if (value === "mangalore") return "mangaluru";
  if (value === "gulbarga") return "kalaburagi";
  if (value === "bellary") return "ballari";
  if (value === "hosapete") return "hospet";

  return value;
}

/* =========================================================
   BUS DATA
   200 BUS SERVICES
========================================================= */

const routeData = [
  { source: "Bengaluru", destination: "Davangere", hours: 3.5, sitting: 300, sleeper: 650 },
  { source: "Bengaluru", destination: "Hubballi", hours: 6.5, sitting: 500, sleeper: 900 },
  { source: "Bengaluru", destination: "Dharwad", hours: 6.25, sitting: 500, sleeper: 900 },
  { source: "Bengaluru", destination: "Belagavi", hours: 8, sitting: 650, sleeper: 1100 },
  { source: "Bengaluru", destination: "Vijayapura", hours: 7, sitting: 600, sleeper: 1000 },
  { source: "Bengaluru", destination: "Bagalkot", hours: 7.5, sitting: 650, sleeper: 1050 },
  { source: "Bengaluru", destination: "Ballari", hours: 6.5, sitting: 550, sleeper: 950 },
  { source: "Bengaluru", destination: "Raichur", hours: 8.5, sitting: 700, sleeper: 1200 },
  { source: "Bengaluru", destination: "Yadgir", hours: 9, sitting: 750, sleeper: 1250 },
  { source: "Bengaluru", destination: "Kalaburagi", hours: 9.5, sitting: 800, sleeper: 1350 },
  { source: "Bengaluru", destination: "Bidar", hours: 11, sitting: 900, sleeper: 1500 },
  { source: "Bengaluru", destination: "Mysuru", hours: 3, sitting: 250, sleeper: 550 },
  { source: "Bengaluru", destination: "Mangaluru", hours: 7, sitting: 650, sleeper: 1100 },
  { source: "Bengaluru", destination: "Udupi", hours: 7.5, sitting: 700, sleeper: 1150 },
  { source: "Mysuru", destination: "Mangaluru", hours: 4.5, sitting: 450, sleeper: 750 },
  { source: "Mysuru", destination: "Hassan", hours: 2.5, sitting: 220, sleeper: 450 },
  { source: "Mysuru", destination: "Madikeri", hours: 3, sitting: 250, sleeper: 500 },
  { source: "Mysuru", destination: "Hubballi", hours: 8, sitting: 700, sleeper: 1150 },
  { source: "Mangaluru", destination: "Udupi", hours: 1.5, sitting: 160, sleeper: 300 },
  { source: "Mangaluru", destination: "Hubballi", hours: 7, sitting: 650, sleeper: 1050 },
  { source: "Mangaluru", destination: "Davangere", hours: 6, sitting: 550, sleeper: 900 },
  { source: "Udupi", destination: "Hubballi", hours: 4.5, sitting: 400, sleeper: 700 },
  { source: "Hassan", destination: "Mangaluru", hours: 3.5, sitting: 320, sleeper: 600 },
  { source: "Hassan", destination: "Davangere", hours: 3, sitting: 280, sleeper: 550 },
  { source: "Davangere", destination: "Hubballi", hours: 2.5, sitting: 250, sleeper: 450 },
  { source: "Davangere", destination: "Ballari", hours: 3.5, sitting: 320, sleeper: 600 },
  { source: "Davangere", destination: "Mysuru", hours: 5.5, sitting: 500, sleeper: 850 },
  { source: "Hubballi", destination: "Belagavi", hours: 2.5, sitting: 250, sleeper: 450 },
  { source: "Hubballi", destination: "Ballari", hours: 3.5, sitting: 320, sleeper: 600 },
  { source: "Hubballi", destination: "Gadag", hours: 1.5, sitting: 160, sleeper: 300 },
  { source: "Dharwad", destination: "Belagavi", hours: 2, sitting: 200, sleeper: 350 },
  { source: "Belagavi", destination: "Vijayapura", hours: 4, sitting: 350, sleeper: 650 },
  { source: "Vijayapura", destination: "Bagalkot", hours: 2, sitting: 180, sleeper: 320 },
  { source: "Vijayapura", destination: "Kalaburagi", hours: 3.5, sitting: 300, sleeper: 550 },
  { source: "Bagalkot", destination: "Hubballi", hours: 3, sitting: 280, sleeper: 500 },
  { source: "Ballari", destination: "Hospet", hours: 1.5, sitting: 150, sleeper: 280 },
  { source: "Hospet", destination: "Davangere", hours: 3, sitting: 280, sleeper: 500 },
  { source: "Raichur", destination: "Yadgir", hours: 2, sitting: 180, sleeper: 320 },
  { source: "Raichur", destination: "Kalaburagi", hours: 3.5, sitting: 300, sleeper: 550 },
  { source: "Raichur", destination: "Davangere", hours: 5.5, sitting: 500, sleeper: 850 },
  { source: "Yadgir", destination: "Kalaburagi", hours: 1.5, sitting: 160, sleeper: 290 },
  { source: "Yadgir", destination: "Davangere", hours: 5, sitting: 450, sleeper: 800 },
  { source: "Kalaburagi", destination: "Bidar", hours: 2.75, sitting: 143, sleeper: 290 },
  { source: "Kalaburagi", destination: "Yadgir", hours: 1.5, sitting: 160, sleeper: 290 },
  { source: "Kalaburagi", destination: "Raichur", hours: 3.5, sitting: 300, sleeper: 550 },
  { source: "Kalaburagi", destination: "Davangere", hours: 5.5, sitting: 500, sleeper: 850 },
  { source: "Bidar", destination: "Kalaburagi", hours: 2.75, sitting: 9, sleeper: 290 },
  { source: "Bidar", destination: "Yadgir", hours: 4, sitting: 350, sleeper: 650 },
  { source: "Bidar", destination: "Raichur", hours: 5.5, sitting: 500, sleeper: 850 },
  { source: "Bidar", destination: "Bengaluru", hours: 11, sitting: 900, sleeper: 1500 },

  // Additional Karnataka routes (sample schedules and fares)
  { source: "Bengaluru", destination: "Chitradurga", hours: 4.5, sitting: 380, sleeper: 700 },
  { source: "Bengaluru", destination: "Shivamogga", hours: 6, sitting: 450, sleeper: 850 },
  { source: "Bengaluru", destination: "Hassan", hours: 3.5, sitting: 300, sleeper: 600 },
  { source: "Bengaluru", destination: "Tumakuru", hours: 1.5, sitting: 140, sleeper: 250 },
  { source: "Bengaluru", destination: "Kolar", hours: 1.5, sitting: 130, sleeper: 240 },
  { source: "Bengaluru", destination: "Chikkaballapur", hours: 1.25, sitting: 120, sleeper: 220 },
  { source: "Bengaluru", destination: "Ramanagara", hours: 1.5, sitting: 120, sleeper: 220 },
  { source: "Bengaluru", destination: "Mandya", hours: 2.5, sitting: 200, sleeper: 400 },
  { source: "Bengaluru", destination: "Chamarajanagar", hours: 4.5, sitting: 350, sleeper: 650 },
  { source: "Bengaluru", destination: "Chikkamagaluru", hours: 5.5, sitting: 450, sleeper: 850 },
  { source: "Bengaluru", destination: "Karwar", hours: 10, sitting: 800, sleeper: 1400 },
  { source: "Bengaluru", destination: "Sirsi", hours: 8.5, sitting: 700, sleeper: 1200 },
  { source: "Bengaluru", destination: "Kundapura", hours: 8.5, sitting: 750, sleeper: 1250 },
  { source: "Bengaluru", destination: "Bhadravati", hours: 5.5, sitting: 430, sleeper: 800 },
  { source: "Mysuru", destination: "Mandya", hours: 1.25, sitting: 100, sleeper: 180 },
  { source: "Mysuru", destination: "Chamarajanagar", hours: 2.5, sitting: 200, sleeper: 380 },
  { source: "Mysuru", destination: "Bengaluru", hours: 3, sitting: 250, sleeper: 550 },
  { source: "Hassan", destination: "Bengaluru", hours: 3.5, sitting: 300, sleeper: 600 },
  { source: "Hassan", destination: "Chikkamagaluru", hours: 1.5, sitting: 150, sleeper: 280 },
  { source: "Chikkamagaluru", destination: "Shivamogga", hours: 3.5, sitting: 280, sleeper: 520 },
  { source: "Shivamogga", destination: "Bhadravati", hours: 0.75, sitting: 80, sleeper: 150 },
  { source: "Shivamogga", destination: "Davangere", hours: 2.5, sitting: 220, sleeper: 400 },
  { source: "Shivamogga", destination: "Udupi", hours: 4, sitting: 350, sleeper: 650 },
  { source: "Davangere", destination: "Chitradurga", hours: 1.5, sitting: 130, sleeper: 240 },
  { source: "Davangere", destination: "Harihar", hours: 0.5, sitting: 60, sleeper: 100 },
  { source: "Davangere", destination: "Ranebennur", hours: 1.5, sitting: 130, sleeper: 240 },
  { source: "Hubballi", destination: "Karwar", hours: 4.5, sitting: 380, sleeper: 700 },
  { source: "Hubballi", destination: "Sirsi", hours: 3.5, sitting: 300, sleeper: 550 },
  { source: "Hubballi", destination: "Haveri", hours: 1.5, sitting: 130, sleeper: 240 },
  { source: "Belagavi", destination: "Gokak", hours: 1.5, sitting: 130, sleeper: 240 },
  { source: "Belagavi", destination: "Athani", hours: 2.5, sitting: 200, sleeper: 380 },
  { source: "Belagavi", destination: "Sankeshwar", hours: 1, sitting: 90, sleeper: 160 },
  { source: "Ballari", destination: "Koppal", hours: 2.5, sitting: 220, sleeper: 400 },
  { source: "Hospet", destination: "Koppal", hours: 1, sitting: 90, sleeper: 160 },
  { source: "Raichur", destination: "Manvi", hours: 1, sitting: 90, sleeper: 160 },
  { source: "Raichur", destination: "Sindhanur", hours: 1.5, sitting: 130, sleeper: 240 },
  { source: "Kalaburagi", destination: "Sedam", hours: 1.5, sitting: 130, sleeper: 240 },
  { source: "Kalaburagi", destination: "Aland", hours: 1, sitting: 90, sleeper: 160 },
  { source: "Bidar", destination: "Basavakalyan", hours: 1.5, sitting: 130, sleeper: 240 },
  { source: "Bidar", destination: "Bhalki", hours: 1, sitting: 90, sleeper: 160 },
  { source: "Udupi", destination: "Kundapura", hours: 1, sitting: 90, sleeper: 160 },
  { source: "Mangaluru", destination: "Kundapura", hours: 2, sitting: 180, sleeper: 320 },
  { source: "Mangaluru", destination: "Madikeri", hours: 3.5, sitting: 300, sleeper: 550 },
  { source: "Mangaluru", destination: "Karwar", hours: 5.5, sitting: 450, sleeper: 800 },
  { source: "Karwar", destination: "Sirsi", hours: 2.5, sitting: 220, sleeper: 400 },
  { source: "Chikkamagaluru", destination: "Madikeri", hours: 3.5, sitting: 300, sleeper: 550 },
  { source: "Tumakuru", destination: "Chitradurga", hours: 2.5, sitting: 220, sleeper: 400 },
  { source: "Kolar", destination: "Chikkaballapur", hours: 1, sitting: 90, sleeper: 160 },
  { source: "Mandya", destination: "Hassan", hours: 2, sitting: 170, sleeper: 320 },
  { source: "Gadag", destination: "Haveri", hours: 1.5, sitting: 130, sleeper: 240 }
];

const busNames = [
  "KSRTC Express",
  "VRL Travels",
  "North Karnataka Express",
  "Smart Bus Travels",
  "GreenLine Travels",
  "CityLink Express",
  "Royal Karnataka",
  "Highway Rider",
  "BlueLine Travels",
  "Comfort Bus",
  "National Express",
  "South India Travels",
  "Karnataka Super Fast",
  "Star Travels",
  "Diamond Express"
];

function formatTime(totalMinutes) {
  const minutesInDay = 24 * 60;
  const value = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hour24 = Math.floor(value / 60);
  const minute = value % 60;
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? "PM" : "AM";
  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${ampm}`;
}

function formatDuration(hours) {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function createBusData() {
  const result = [];
  let id = 1;

  routeData.forEach((route, routeIndex) => {
    ["Sitting", "Sleeper"].forEach((type, variantIndex) => {
      const departureMinutes = 300 + ((routeIndex * 37 + variantIndex * 420) % 900);
      const durationMinutes = Math.round(route.hours * 60);
      const arrivalMinutes = departureMinutes + durationMinutes;

      result.push({
        id,
        name: busNames[(routeIndex * 2 + variantIndex) % busNames.length],
        type,
        source: route.source,
        destination: route.destination,
        departure: formatTime(departureMinutes),
        arrival: formatTime(arrivalMinutes),
        duration: formatDuration(route.hours),
        price: type === "Sitting" ? route.sitting : route.sleeper,
        seats: type === "Sitting" ? 50 : 30
      });

      id += 1;
    });
  });

  return result;
}

const buses = createBusData();

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

/* =========================================================
   INITIAL OCCUPIED SEATS
   ONLY SOME SEATS ARE PRE-BOOKED
========================================================= */

const initialOccupiedSeats = {
  1: {
    3: "female",
    8: "male",
    17: "female",
    29: "male"
  },

  2: {
    2: "female",
    7: "male",
    14: "female",
    23: "male"
  },

  3: {
    5: "female",
    12: "male"
  },

  4: {
    4: "female",
    9: "male",
    18: "female"
  },

  5: {
    10: "female",
    21: "male"
  }
};

/* =========================================================
   APP
========================================================= */

function App() {
  const [page, setPage] = useState("home");

  /* ---------------- USER ---------------- */

  const [registeredUsers, setRegisteredUsers] =
    useState(() => {
      try {
        const savedUsers = JSON.parse(
          localStorage.getItem("smartBusRegisteredUsers")
        ) || [];

        // Keep only profile details in the browser; never cache passwords here.
        return savedUsers.map(({ password, ...profile }) => profile);
      } catch {
        return [];
      }
    });

  const [loggedIn, setLoggedIn] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [loginEmail, setLoginEmail] =
    useState("");

  const [loginPassword, setLoginPassword] =
    useState("");

  const [showLoginPassword, setShowLoginPassword] =
    useState(false);

  const [forgotEmail, setForgotEmail] =
    useState("");

  const [forgotPhone, setForgotPhone] =
    useState("");

  const [forgotPassword, setForgotPassword] =
    useState("");

  const [forgotConfirmPassword, setForgotConfirmPassword] =
    useState("");

  const [showForgotPassword, setShowForgotPassword] =
    useState(false);

  const [signupName, setSignupName] =
    useState("");

  const [signupEmail, setSignupEmail] =
    useState("");

  const [signupPhone, setSignupPhone] =
    useState("");

  const [signupPassword, setSignupPassword] =
    useState("");

  /* ---------------- SEARCH ---------------- */

  const [source, setSource] =
    useState("");

  const [destination, setDestination] =
    useState("");

  const [journeyDate, setJourneyDate] =
    useState("");

  const [passengers, setPassengers] =
    useState(1);

  const [searchResults, setSearchResults] =
    useState([]);

  const [searchMessage, setSearchMessage] =
    useState("");

  /* ---------------- BUS ---------------- */

  const [selectedBus, setSelectedBus] =
    useState(null);

  const [selectedSeats, setSelectedSeats] =
    useState([]);

  /* ---------------- PASSENGERS ---------------- */

  const [passengerDetails, setPassengerDetails] =
    useState([]);

  /* ---------------- PAYMENT ---------------- */

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [paymentNumber, setPaymentNumber] =
    useState("");

  /* ---------------- BOOKING ---------------- */

  const [booking, setBooking] =
    useState(null);

  const [myBookings, setMyBookings] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "smartBusBookings"
          )
        ) || [];
      } catch {
        return [];
      }
    });

  /* ---------------- SEATS ---------------- */

  const [occupiedSeats, setOccupiedSeats] =
    useState(() => {
      try {
        return (
          JSON.parse(
            localStorage.getItem(
              "smartBusOccupiedSeats"
            )
          ) ||
          initialOccupiedSeats
        );
      } catch {
        return initialOccupiedSeats;
      }
    });

  /* ---------------- ADMIN ---------------- */

  const [adminLoggedIn, setAdminLoggedIn] =
    useState(false);

  const [adminEmail, setAdminEmail] =
    useState("");

  const [adminPassword, setAdminPassword] =
    useState("");

  /* =========================================================
     SAVE DATA
  ========================================================= */

  useEffect(() => {
    const safeProfiles = registeredUsers.map(({ password, ...profile }) => profile);
    localStorage.setItem(
      "smartBusRegisteredUsers",
      JSON.stringify(safeProfiles)
    );
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem(
      "smartBusBookings",
      JSON.stringify(myBookings)
    );
  }, [myBookings]);

  useEffect(() => {
    localStorage.setItem(
      "smartBusOccupiedSeats",
      JSON.stringify(occupiedSeats)
    );
  }, [occupiedSeats]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  function goHome() {
    setPage("home");
    window.scrollTo(0, 0);
  }

  function openSearch() {
    if (!loggedIn) {
      alert(
        "Please sign up first and then login before searching for buses."
      );

      setPage("signup");
      return;
    }

    setPage("search");
    window.scrollTo(0, 0);
  }

  function openMyBookings() {
    if (!loggedIn) {
      alert("Please login to view your bookings.");
      setPage("login");
      return;
    }

    setPage("myBookings");
    window.scrollTo(0, 0);
  }

  function logout() {
    setLoggedIn(false);
    setUser(null);
    setPage("home");
  }

  /* =========================================================
     FORGOT PASSWORD PAGE
  ========================================================= */

  function renderForgotPassword() {
    return (
      <div className="auth-page user-auth-page">
        <div className="container page-container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card shadow p-4">
                <h2 className="text-center mb-4">
                  Reset Password
                </h2>

                <p className="text-center text-muted mb-4">
                  Enter the email address and phone number used during registration,
                  then choose a new password.
                </p>

                <form onSubmit={handleForgotPassword}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="reset-email">
                      Registered Email
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      className="form-control"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter registered email"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="reset-phone">
                      Registered Phone Number
                    </label>
                    <input
                      id="reset-phone"
                      type="tel"
                      className="form-control"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      placeholder="Enter registered phone number"
                      autoComplete="tel"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="reset-new-password">
                      New Password
                    </label>
                    <div className="password-input-group" style={{ position: "relative" }}>
                      <input
                        id="reset-new-password"
                        type={showForgotPassword ? "text" : "password"}
                        className="form-control"
                        style={{ paddingRight: "3rem" }}
                        value={forgotPassword}
                        onChange={(e) => setForgotPassword(e.target.value)}
                        placeholder="Create a new password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        className="password-eye-btn"
                        style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", border: 0, background: "transparent", cursor: "pointer", zIndex: 2 }}
                        onClick={() => setShowForgotPassword((value) => !value)}
                        aria-label={showForgotPassword ? "Hide new password" : "Show new password"}
                        aria-pressed={showForgotPassword}
                        title={showForgotPassword ? "Hide password" : "Show password"}
                      >
                        {showForgotPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="reset-confirm-password">
                      Confirm New Password
                    </label>
                    <input
                      id="reset-confirm-password"
                      type={showForgotPassword ? "text" : "password"}
                      className="form-control"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                  >
                    Set New Password
                  </button>
                </form>

                <p className="small text-muted mt-3 mb-0">
                  This project demo checks that the email and phone number match the
                  registered account. It does not send an SMS OTP.
                </p>

                <button
                  type="button"
                  className="btn btn-link mt-3"
                  onClick={() => setPage("login")}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     SIGN UP — Java backend / MySQL
  ========================================================= */

  async function handleSignup(event) {
    event.preventDefault();

    const name = signupName.trim();
    const email = signupEmail.trim().toLowerCase();
    const phone = signupPhone.trim();

    if (!name || !email || !phone || !signupPassword.trim()) {
      alert("Please fill all registration fields.");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", signupPassword);

      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || !data.success) {
        alert(data?.message || `Registration failed (HTTP ${response.status}).`);
        return;
      }

      const profile = {
        id: data.user?.userId ?? Date.now(),
        name,
        email,
        phone
      };

      // Keep a password-free profile cache for the existing local admin display.
      setRegisteredUsers((currentUsers) => {
        const alreadyListed = currentUsers.some(
          (item) => item.email?.toLowerCase() === email
        );
        return alreadyListed ? currentUsers : [...currentUsers, profile];
      });

      setUser({ name, email, phone });
      setLoggedIn(true);
      setSignupName("");
      setSignupEmail("");
      setSignupPhone("");
      setSignupPassword("");

      alert("Registration successful!");
      setPage("home");
    } catch (error) {
      console.error("Registration error:", error);
      alert(
        "Could not reach the Java backend. Check that Tomcat is running and that CORS is configured."
      );
    }
  }

  /* =========================================================
     LOGIN — Java backend / MySQL
  ========================================================= */

  async function handleLogin(event) {
    event.preventDefault();

    const email = loginEmail.trim().toLowerCase();
    if (!email || !loginPassword.trim()) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", loginPassword);

      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || !data.success || !data.user) {
        alert(data?.message || `Login failed (HTTP ${response.status}).`);
        return;
      }

      const profile = {
        id: data.user.userId ?? Date.now(),
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || ""
      };

      // Keep a password-free profile cache for the existing local admin display.
      setRegisteredUsers((currentUsers) => {
        const alreadyListed = currentUsers.some(
          (item) => item.email?.toLowerCase() === profile.email.toLowerCase()
        );
        return alreadyListed ? currentUsers : [...currentUsers, profile];
      });

      setUser({
        name: profile.name,
        email: profile.email,
        phone: profile.phone
      });
      setLoggedIn(true);
      setLoginPassword("");
      alert("Login successful!");
      setPage("home");
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Could not reach the Java backend. Check that Tomcat is running and that CORS is configured."
      );
    }
  }

  /* =========================================================
     SEARCH CITY SUGGESTIONS
  ========================================================= */

  const sourceSuggestions =
    useMemo(() => {
      if (!source.trim()) return [];

      const text =
        source.toLowerCase().trim();

      return cities
        .filter((city) =>
          city.toLowerCase().startsWith(text)
        )
        .slice(0, 8);
    }, [source]);

  const destinationSuggestions =
    useMemo(() => {
      if (!destination.trim()) return [];

      const text =
        destination.toLowerCase().trim();

      return cities
        .filter((city) =>
          city.toLowerCase().startsWith(text)
        )
        .slice(0, 8);
    }, [destination]);

  /* =========================================================
     SEARCH BUSES
  ========================================================= */

  function handleSearch(event) {
    event.preventDefault();

    if (!loggedIn) {
      alert(
        "Please sign up and login first."
      );

      setPage("signup");
      return;
    }

    if (
      !source ||
      !destination ||
      !journeyDate
    ) {
      alert(
        "Please enter source, destination and journey date."
      );
      return;
    }

    if (
      normalizeCity(source) ===
      normalizeCity(destination)
    ) {
      alert(
        "Source and destination cannot be the same."
      );
      return;
    }

    if (
      Number(passengers) < 1 ||
      Number(passengers) > 6
    ) {
      alert(
        "Passengers must be between 1 and 6."
      );
      return;
    }

    const results =
      buses.filter((bus) => {
        return (
          normalizeCity(bus.source) ===
            normalizeCity(source) &&
          normalizeCity(bus.destination) ===
            normalizeCity(destination)
        );
      });

    setSearchResults(results);

    if (results.length > 0) {
      setSearchMessage(
        `${results.length} bus services found.`
      );
    } else {
      setSearchMessage(
        `No direct bus service found from ${source} to ${destination}.`
      );
    }

    setPage("results");

    window.scrollTo(0, 0);
  }

  /* =========================================================
     SELECT BUS
  ========================================================= */

  function selectBus(bus) {
    setSelectedBus(bus);
    setSelectedSeats([]);
    setPassengerDetails([]);
    setPage("seats");

    window.scrollTo(0, 0);
  }

  /* =========================================================
     SEAT STATUS
  ========================================================= */

  function getSeatStatus(seat) {
    if (!selectedBus) return null;

    const busSeats =
      occupiedSeats[selectedBus.id] ||
      {};

    return busSeats[seat] || null;
  }

  /* =========================================================
     SITTING BUS
     2 + 3 LAYOUT
     
     Example:
     
     1  2     3  4  5
     6  7     8  9 10
     11 12   13 14 15
  ========================================================= */

  function getSittingRows() {
    const rows = [];

    for (
      let start = 1;
      start <= 50;
      start += 5
    ) {
      rows.push([
        start,
        start + 1,
        start + 2,
        start + 3,
        start + 4
      ]);
    }

    return rows;
  }

  /* =========================================================
     SLEEPER BUS
     UPPER AND LOWER
     1 + 2 LAYOUT
  ========================================================= */

  function getSleeperRows() {
    const rows = [];

    for (
      let start = 1;
      start <= 30;
      start += 3
    ) {
      rows.push([
        start,
        start + 1,
        start + 2
      ]);
    }

    return rows;
  }

  /* =========================================================
     ADJACENT SEATS FOR SITTING BUS
     
     In 2+3:
     
     1 2 | 3 4 5
     
     Seat 2 is beside seat 1.
     Seat 3 is beside seat 4.
     
     We do not treat the aisle as an adjacent seat.
  ========================================================= */

  function getAdjacentSittingSeats(
    seat
  ) {
    const number = Number(seat);

    if (!number) return [];

    const position =
      (number - 1) % 5;

    const adjacent = [];

    if (position === 0) {
      adjacent.push(number + 1);
    }

    if (position === 1) {
      adjacent.push(number - 1);
    }

    if (position === 2) {
      adjacent.push(number + 1);
    }

    if (position === 3) {
      adjacent.push(
        number - 1,
        number + 1
      );
    }

    if (position === 4) {
      adjacent.push(number - 1);
    }

    return adjacent;
  }

  /* =========================================================
     CHECK WHETHER SEAT IS BESIDE A PREVIOUSLY
     BOOKED FEMALE
     
     IMPORTANT:
     This checks only seats already occupied.
     
     It does NOT check passengers in the current booking.
     
     Therefore:
     Male + Female booking together = ALLOWED.
  ========================================================= */

  function isNextToFemale(seat) {
    if (!selectedBus) return false;

    if (
      selectedBus.type !== "Sitting"
    ) {
      return false;
    }

    const busSeats =
      occupiedSeats[selectedBus.id] ||
      {};

    const adjacent =
      getAdjacentSittingSeats(seat);

    return adjacent.some(
      (item) =>
        busSeats[item] === "female"
    );
  }

  /* =========================================================
     HANDLE SEAT CLICK
  ========================================================= */

  function handleSeatClick(seat) {
    if (!selectedBus) return;

    const status =
      getSeatStatus(seat);

    if (status === "female") {
      alert(
        "This seat is already reserved by a female passenger."
      );
      return;
    }

    if (status === "male") {
      alert(
        "This seat is already reserved by a male passenger."
      );
      return;
    }

    if (
      selectedBus.type === "Sitting" &&
      isNextToFemale(seat)
    ) {
      alert(
        "This seat is beside a previously booked female passenger. Please select another seat."
      );
      return;
    }

    if (
      selectedSeats.includes(seat)
    ) {
      setSelectedSeats(
        selectedSeats.filter(
          (item) => item !== seat
        )
      );

      return;
    }

    if (
      selectedSeats.length >=
      Number(passengers)
    ) {
      alert(
        `You can select only ${passengers} seat(s).`
      );
      return;
    }

    setSelectedSeats([
      ...selectedSeats,
      seat
    ]);
  }

  /* =========================================================
     CONTINUE TO PASSENGER DETAILS
  ========================================================= */

  function continueToPassengerDetails() {
    if (
      selectedSeats.length !==
      Number(passengers)
    ) {
      alert(
        `Please select exactly ${passengers} seat(s).`
      );
      return;
    }

    const details =
      selectedSeats.map(
        (seat) => ({
          seat,
          name: "",
          age: "",
          gender: ""
        })
      );

    setPassengerDetails(details);

    setPage("passengers");

    window.scrollTo(0, 0);
  }

  /* =========================================================
     UPDATE PASSENGER
  ========================================================= */

  function updatePassenger(
    index,
    field,
    value
  ) {
    const updated =
      [...passengerDetails];

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    setPassengerDetails(
      updated
    );
  }

  /* =========================================================
     CONTINUE TO PAYMENT
     
     NO GENDER RESTRICTION BETWEEN PASSENGERS
     IN THE SAME BOOKING.
  ========================================================= */

  function continueToPayment() {
    for (
      const passenger of
      passengerDetails
    ) {
      if (
        !passenger.name.trim() ||
        !passenger.age ||
        !passenger.gender
      ) {
        alert(
          "Please fill all passenger details including gender."
        );
        return;
      }

      if (
        Number(passenger.age) < 1 ||
        Number(passenger.age) > 100
      ) {
        alert(
          "Please enter a valid passenger age."
        );
        return;
      }
    }

    /*
      IMPORTANT:
      We intentionally DO NOT compare the genders
      of passengers in the current booking.

      Example:

      Passenger 1 -> Female -> Seat 10
      Passenger 2 -> Male   -> Seat 11

      This is ALLOWED because they are booking
      together in the same transaction.
    */

    setPaymentNumber("");

    setPage("payment");

    window.scrollTo(0, 0);
  }

  /* =========================================================
     MAKE PAYMENT
  ========================================================= */

  function makePayment(event) {
    event.preventDefault();

    if (
      !paymentNumber.trim()
    ) {
      alert(
        "Please enter payment details."
      );
      return;
    }

    const bookingId =
      "SB" +
      Date.now()
        .toString()
        .slice(-8);

    const newBooking = {
      id: bookingId,
      userEmail: user?.email || "",
      userName: user?.name || "",
      bus: selectedBus,
      source,
      destination,
      journeyDate,
      passengers:
        passengerDetails,
      total:
        Number(selectedBus.price) *
        Number(passengers),
      paymentMethod,
      bookingTime:
        new Date().toLocaleString()
    };

    setBooking(newBooking);

    setMyBookings([
      ...myBookings,
      newBooking
    ]);

    const currentSeats =
      occupiedSeats[
        selectedBus.id
      ] || {};

    const updatedSeats = {
      ...currentSeats
    };

    /*
      Only AFTER payment is completed,
      the seat gets Male/Female status.
    */

    passengerDetails.forEach(
      (passenger) => {
        updatedSeats[
          passenger.seat
        ] =
          passenger.gender.toLowerCase();
      }
    );

    setOccupiedSeats({
      ...occupiedSeats,
      [selectedBus.id]:
        updatedSeats
    });

    setPage("ticket");

    window.scrollTo(0, 0);
  }

  /* =========================================================
     CANCEL BOOKING
  ========================================================= */

  function cancelBooking(id) {
    const bookingToCancel =
      myBookings.find(
        (item) =>
          item.id === id
      );

    if (!bookingToCancel) {
      return;
    }

    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmCancel) {
      return;
    }

    const updatedBookings =
      myBookings.filter(
        (item) =>
          item.id !== id
      );

    setMyBookings(
      updatedBookings
    );

    const busId =
      bookingToCancel.bus.id;

    const busSeats = {
      ...(occupiedSeats[
        busId
      ] || {})
    };

    bookingToCancel.passengers.forEach(
      (passenger) => {
        delete busSeats[
          passenger.seat
        ];
      }
    );

    setOccupiedSeats({
      ...occupiedSeats,
      [busId]: busSeats
    });

    if (
      booking &&
      booking.id === id
    ) {
      setBooking(null);
    }

    alert(
      "Booking cancelled successfully."
    );
  }

  /* =========================================================
     ADMIN LOGIN
  ========================================================= */

  function handleAdminLogin(event) {
    event.preventDefault();

    if (
      adminEmail.trim().toLowerCase() === ADMIN_EMAIL &&
      adminPassword === ADMIN_PASSWORD
    ) {
      setAdminLoggedIn(true);
      setPage("adminDashboard");
      return;
    }

    alert("Invalid admin email or password.");
  }

  /* =========================================================
     HOME
  ========================================================= */

  function renderHome() {
    // After login (or successful registration), show the booking form
    // immediately on the Home Page instead of requiring another click.
    if (loggedIn && user) {
      return (
        <>
          <section className="py-4" style={{ background: "linear-gradient(135deg, #0d6efd, #084298)", color: "white" }}>
            <div className="container">
              <h1 className="mb-2">Welcome, {user.name}!</h1>
              <p className="mb-0">Where would you like to travel today?</p>
            </div>
          </section>

          <div className="py-4">
            {renderSearch()}
          </div>

          <section className="features-section">
            <div className="container">
              <div className="row g-4">
                <div className="col-md-3">
                  <div className="feature-card">
                    <div className="feature-icon">🚌</div>
                    <h4>Bus Services</h4>
                    <p>Choose from multiple bus services and routes.</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="feature-card">
                    <div className="feature-icon">💺</div>
                    <h4>Comfortable Travel</h4>
                    <p>Choose sitting or sleeper bus services.</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="feature-card">
                    <div className="feature-icon">🛡️</div>
                    <h4>Safe & Secure</h4>
                    <p>View seat availability before selecting seats.</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="feature-card">
                    <div className="feature-icon">💳</div>
                    <h4>Easy Booking</h4>
                    <p>Enter passenger details and complete demo payment.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      );
    }

    // Visitors who are not logged in see the welcome page and can sign in.
    return (
      <>
        <section className="hero-home">
          <div className="hero-overlay">
            <div className="container">
              <div className="row align-items-center min-vh-75">
                <div className="col-lg-6 text-white">
                  <p className="hero-small">Welcome to</p>
                  <h1 className="hero-title">
                    Smart Bus<br />Reservation System
                  </h1>
                  <p className="hero-description">
                    Book your bus tickets easily, safely and comfortably. Travel more,
                    worry less.
                  </p>
                  <div className="d-flex gap-3 flex-wrap">
                    <button
                      className="btn btn-light btn-lg hero-search-button"
                      onClick={() => setPage("login")}
                    >
                      Login to Book Buses
                    </button>
                    <button
                      className="btn btn-outline-light btn-lg"
                      onClick={() => setPage("signup")}
                    >
                      Create Account
                    </button>
                  </div>
                </div>
                <div className="col-lg-6 text-center">
                  <div className="bus-hero-placeholder">
                    <div className="big-bus">🚌</div>
                    <h2>SMART BUS</h2>
                    <p>Safe • Comfortable • Reliable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-3"><div className="feature-card"><div className="feature-icon">🚌</div><h4>Bus Services</h4><p>Choose from multiple bus services and routes.</p></div></div>
              <div className="col-md-3"><div className="feature-card"><div className="feature-icon">💺</div><h4>Comfortable Travel</h4><p>Choose sitting or sleeper bus services.</p></div></div>
              <div className="col-md-3"><div className="feature-card"><div className="feature-icon">🛡️</div><h4>Safe & Secure</h4><p>View seat availability before selecting seats.</p></div></div>
              <div className="col-md-3"><div className="feature-card"><div className="feature-icon">💳</div><h4>Easy Booking</h4><p>Complete your booking in a few simple steps.</p></div></div>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* =========================================================
     LOGIN
  ========================================================= */

  function renderLogin() {
    return (
      <div className="auth-page user-auth-page">
        <div className="container page-container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card shadow p-4">
                <h2 className="text-center mb-4">
                  User Login
              </h2>

              <div className="alert alert-info">
                New user? Please{" "}
                <strong>
                  Sign Up first
                </strong>{" "}
                before logging in.
              </div>

              <form
                onSubmit={
                  handleLogin
                }
              >
                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={
                      loginEmail
                    }
                    onChange={(e) =>
                      setLoginEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter registered email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <div className="password-input-group" style={{ position: "relative" }}>
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      className="form-control"
                      style={{ paddingRight: "3rem" }}
                      value={
                        loginPassword
                      }
                      onChange={(e) =>
                        setLoginPassword(
                          e.target.value
                        )
                      }
                      placeholder="Enter password"
                    />

                    <button
                      type="button"
                      className="password-eye-btn"
                      style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", border: 0, background: "transparent", cursor: "pointer", zIndex: 2 }}
                      onClick={() =>
                        setShowLoginPassword((value) => !value)
                      }
                      aria-label={
                        showLoginPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      aria-pressed={showLoginPassword}
                      title={
                        showLoginPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showLoginPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Login
                </button>
              </form>

              <button
                type="button"
                className="forgot-password-link"
                onClick={() => {
                  setForgotEmail(loginEmail);
                  setPage("forgotPassword");
                }}
              >
                Forgot Password?
              </button>

              <button
                className="btn btn-link mt-1"
                onClick={() =>
                  setPage("signup")
                }
              >
                New user? Create Account
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     SIGN UP
  ========================================================= */

  function renderSignup() {
    return (
      <div className="auth-page user-auth-page">
        <div className="container page-container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow p-4">
              <h2 className="text-center mb-4">
                Create Account
              </h2>

              <form
                onSubmit={
                  handleSignup
                }
              >
                <div className="mb-3">
                  <label className="form-label">
                    Full Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={
                      signupName
                    }
                    onChange={(e) =>
                      setSignupName(
                        e.target.value
                      )
                    }
                    placeholder="Enter full name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={
                      signupEmail
                    }
                    onChange={(e) =>
                      setSignupEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    className="form-control"
                    value={
                      signupPhone
                    }
                    onChange={(e) =>
                      setSignupPhone(
                        e.target.value
                      )
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    value={
                      signupPassword
                    }
                    onChange={(e) =>
                      setSignupPassword(
                        e.target.value
                      )
                    }
                    placeholder="Create password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                >
                  Sign Up
                </button>
              </form>

                <button
                  className="btn btn-link mt-3"
                  onClick={() =>
                    setPage("login")
                  }
                >
                  Already registered?
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     FORGOT PASSWORD
  ========================================================= */

  async function handleForgotPassword(event) {
    event.preventDefault();

    const email = forgotEmail.trim().toLowerCase();
    const phone = forgotPhone.trim();

    if (!email || !phone || !forgotPassword || !forgotConfirmPassword) {
      alert("Please fill in your registered email, phone number and both password fields.");
      return;
    }

    if (forgotPassword.length < 8) {
      alert("Your new password must contain at least 8 characters.");
      return;
    }

    if (forgotPassword !== forgotConfirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", forgotPassword);

      const response = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || !data.success) {
        alert(data?.message || `Password reset failed (HTTP ${response.status}).`);
        return;
      }

      setLoginEmail(email);
      setLoginPassword("");
      setForgotEmail("");
      setForgotPhone("");
      setForgotPassword("");
      setForgotConfirmPassword("");
      setShowForgotPassword(false);

      alert("Password reset successful. Please log in with your new password.");
      setPage("login");
    } catch (error) {
      console.error("Password reset error:", error);
      alert("Could not reach the Java backend. Check that Tomcat is running and CORS is configured.");
    }
  }

  /* =========================================================
     SEARCH
  ========================================================= */

  function renderSearch() {
    return (
      <div className="container page-container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="card shadow p-4">
              <h2 className="text-center mb-4">
                Search Bus Services
              </h2>

              <form
                onSubmit={
                  handleSearch
                }
              >
                <div className="row g-3">
                  <div className="col-md-6 position-relative">
                    <label className="form-label">
                      Source
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={source}
                      onChange={(e) =>
                        setSource(
                          e.target.value
                        )
                      }
                      placeholder="Type city name"
                      autoComplete="off"
                    />

                    {sourceSuggestions.length >
                      0 && (
                      <div className="city-suggestions">
                        {sourceSuggestions.map(
                          (city) => (
                            <button
                              type="button"
                              key={city}
                              onClick={() =>
                                setSource(
                                  city
                                )
                              }
                            >
                              {city}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6 position-relative">
                    <label className="form-label">
                      Destination
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={
                        destination
                      }
                      onChange={(e) =>
                        setDestination(
                          e.target.value
                        )
                      }
                      placeholder="Type city name"
                      autoComplete="off"
                    />

                    {destinationSuggestions.length >
                      0 && (
                      <div className="city-suggestions">
                        {destinationSuggestions.map(
                          (city) => (
                            <button
                              type="button"
                              key={city}
                              onClick={() =>
                                setDestination(
                                  city
                                )
                              }
                            >
                              {city}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Journey Date
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      value={
                        journeyDate
                      }
                      onChange={(e) =>
                        setJourneyDate(
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      Number of Passengers
                    </label>

                    <select
                      className="form-select"
                      value={
                        passengers
                      }
                      onChange={(e) =>
                        setPassengers(
                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                    >
                      {[1, 2, 3, 4, 5, 6].map(
                        (number) => (
                          <option
                            key={
                              number
                            }
                            value={
                              number
                            }
                          >
                            {number}{" "}
                            Passenger
                            {number >
                            1
                              ? "s"
                              : ""}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-4"
                >
                  🔎 Search Bus Services
                </button>
              </form>

              <div className="alert alert-secondary mt-4 mb-0">
                <strong>
                  City search:
                </strong>{" "}
                Type{" "}
                <strong>
                  "gu"
                </strong>{" "}
                to see cities such as
                Gulbarga.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     RESULTS
  ========================================================= */

  function renderResults() {
    return (
      <div className="container page-container">
        <h2>
          Available Bus Services
        </h2>

        <div className="alert alert-info mt-3">
          {searchMessage}
        </div>

        {searchResults.length ===
        0 ? (
          <div className="card shadow p-5 text-center">
            <div className="display-4">
              🚌
            </div>

            <h3 className="text-danger mt-3">
              No Direct Bus Service
              Found
            </h3>

            <p>
              We couldn't find a direct
              bus service for:
            </p>

            <h5>
              {source} →{" "}
              {destination}
            </h5>

            <p className="text-muted">
              Try another nearby city
              or route.
            </p>

            <button
              className="btn btn-primary"
              onClick={() =>
                setPage("search")
              }
            >
              Search Again
            </button>
          </div>
        ) : (
          <div className="row g-4 mt-1">
            {searchResults.map(
              (bus) => (
                <div
                  className="col-lg-6"
                  key={bus.id}
                >
                  <div className="card shadow p-4 h-100">
                    <div className="d-flex justify-content-between align-items-start">
                      <h4>
                        {bus.name}
                      </h4>

                      <span
                        className={
                          bus.type ===
                          "Sleeper"
                            ? "badge bg-warning text-dark"
                            : "badge bg-success"
                        }
                      >
                        {bus.type}
                      </span>
                    </div>

                    <hr />

                    <p>
                      <strong>
                        Route:
                      </strong>{" "}
                      {bus.source} →{" "}
                      {bus.destination}
                    </p>

                    <p>
                      <strong>
                        Departure:
                      </strong>{" "}
                      {bus.departure}
                    </p>

                    <p>
                      <strong>
                        Arrival:
                      </strong>{" "}
                      {bus.arrival}
                    </p>

                    <p>
                      <strong>
                        Fare:
                      </strong>{" "}
                      ₹{bus.price}
                    </p>

                    <p>
                      <strong>
                        Capacity:
                      </strong>{" "}
                      {bus.seats}{" "}
                      seats
                    </p>

                    <button
                      className="btn btn-primary w-100 mt-auto"
                      onClick={() =>
                        selectBus(
                          bus
                        )
                      }
                    >
                      Select Bus
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
     SITTING SEAT
  ========================================================= */

  function renderSittingSeat(
    seat
  ) {
    const status =
      getSeatStatus(seat);

    let className =
      "seat-button seat-available";

    if (
      status === "female"
    ) {
      className =
        "seat-button seat-female";
    } else if (
      status === "male"
    ) {
      className =
        "seat-button seat-male";
    } else if (
      selectedSeats.includes(
        seat
      )
    ) {
      className =
        "seat-button seat-selected";
    } else if (
      isNextToFemale(seat)
    ) {
      className =
        "seat-button seat-restricted";
    }

    return (
      <button
        type="button"
        key={seat}
        className={className}
        onClick={() =>
          handleSeatClick(
            seat
          )
        }
        disabled={
          Boolean(status) ||
          isNextToFemale(seat)
        }
      >
        {seat}
      </button>
    );
  }

  /* =========================================================
     SITTING LAYOUT
     2 + 3
  ========================================================= */

  function renderSittingSeats() {
    const rows =
      getSittingRows();

    return (
      <div className="bus-visual">
        <div className="bus-front">
          🚌 FRONT / DRIVER
        </div>

        <div className="sitting-bus-body">
          {rows.map(
            (row, index) => (
              <div
                className="sitting-row"
                key={index}
              >
                <div className="seat-group-two">
                  {renderSittingSeat(
                    row[0]
                  )}

                  {renderSittingSeat(
                    row[1]
                  )}
                </div>

                <div className="bus-aisle">
                  {index === 0
                    ? "AISLE"
                    : ""}
                </div>

                <div className="seat-group-three">
                  {renderSittingSeat(
                    row[2]
                  )}

                  {renderSittingSeat(
                    row[3]
                  )}

                  {renderSittingSeat(
                    row[4]
                  )}
                </div>
              </div>
            )
          )}
        </div>

        <div className="bus-back">
          FULL SEAT
        </div>
      </div>
    );
  }

  /* =========================================================
     SLEEPER SEAT
  ========================================================= */

  function renderSleeperSeat(
    seat,
    label
  ) {
    const status =
      getSeatStatus(seat);

    let className =
      "sleeper-berth sleeper-available";

    if (
      status === "female"
    ) {
      className =
        "sleeper-berth sleeper-female";
    } else if (
      status === "male"
    ) {
      className =
        "sleeper-berth sleeper-male";
    } else if (
      selectedSeats.includes(
        seat
      )
    ) {
      className =
        "sleeper-berth sleeper-selected";
    }

    return (
      <button
        type="button"
        className={className}
        onClick={() =>
          handleSeatClick(
            seat
          )
        }
        disabled={Boolean(
          status
        )}
      >
        <span>
          {label}
        </span>

        <strong>
          {seat}
        </strong>
      </button>
    );
  }

  /* =========================================================
     SLEEPER LAYOUT
     1 + 2
  ========================================================= */

  function renderSleeperSeats() {
    const rows =
      getSleeperRows();

    return (
      <div className="sleeper-bus-visual">
        <div className="bus-front">
          🚌 FRONT / DRIVER
        </div>

        <h5 className="text-center mt-4">
          LOWER BERTHS
        </h5>

        <div className="sleeper-floor">
          {rows.map(
            (row, index) => (
              <div
                className="sleeper-row"
                key={index}
              >
                <div className="sleeper-single">
                  {renderSleeperSeat(
                    row[0],
                    "SINGLE"
                  )}
                </div>

                <div className="sleeper-aisle"></div>

                <div className="sleeper-double">
                  {renderSleeperSeat(
                    row[1],
                    "DOUBLE"
                  )}

                  {renderSleeperSeat(
                    row[2],
                    "DOUBLE"
                  )}
                </div>
              </div>
            )
          )}
        </div>

        <hr className="my-5" />

        <h5 className="text-center">
          UPPER BERTHS
        </h5>

        <div className="sleeper-floor">
          {rows.map(
            (row, index) => {
              const upperStart =
                row[0] + 30;

              const upperSeats = [
                upperStart,
                upperStart + 1,
                upperStart + 2
              ];

              return (
                <div
                  className="sleeper-row"
                  key={index}
                >
                  <div className="sleeper-single">
                    {renderSleeperSeat(
                      upperSeats[0],
                      "SINGLE"
                    )}
                  </div>

                  <div className="sleeper-aisle"></div>

                  <div className="sleeper-double">
                    {renderSleeperSeat(
                      upperSeats[1],
                      "DOUBLE"
                    )}

                    {renderSleeperSeat(
                      upperSeats[2],
                      "DOUBLE"
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div className="bus-back mt-4">
          FULL SEAT / BERTH
        </div>
      </div>
    );
  }

  /* =========================================================
     SEAT SELECTION PAGE
  ========================================================= */

  function renderSeats() {
    return (
      <div className="container page-container">
        <div className="card shadow p-4">
          <div className="text-center">
            <h2>
              Select Your Seat
            </h2>

            <h4 className="mt-3">
              {selectedBus?.name}
            </h4>

            <p>
              {selectedBus?.source} →{" "}
              {
                selectedBus?.destination
              }
            </p>

            <span className="badge bg-primary">
              {selectedBus?.type}
            </span>

            <p className="mt-3">
              Number of Passengers:{" "}
              <strong>
                {passengers}
              </strong>
            </p>
          </div>

          <div className="seat-information">
            <span>
              <span className="legend-square available-square"></span>
              Available
            </span>

            <span>
              <span className="legend-square selected-square"></span>
              Selected
            </span>

            <span>
              <span className="legend-square female-square"></span>
              Female Occupied
            </span>

            <span>
              <span className="legend-square male-square"></span>
              Male Occupied
            </span>

            {selectedBus?.type ===
              "Sitting" && (
              <span>
                <span className="legend-square restricted-square"></span>
                Restricted
              </span>
            )}
          </div>

          {selectedBus?.type ===
          "Sitting"
            ? renderSittingSeats()
            : renderSleeperSeats()}

          <div className="selected-seat-summary">
            <h5>
              Selected Seats
            </h5>

            <div>
              {selectedSeats.length >
              0
                ? selectedSeats.join(
                    ", "
                  )
                : "No seats selected"}
            </div>

            <p className="mt-2 mb-0">
              Select exactly{" "}
              <strong>
                {passengers}
              </strong>{" "}
              seat(s).
            </p>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn btn-primary btn-lg"
              onClick={
                continueToPassengerDetails
              }
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     PASSENGER DETAILS
  ========================================================= */

  function renderPassengerDetails() {
    return (
      <div className="container page-container">
        <div className="card shadow p-4">
          <h2 className="text-center mb-4">
            Passenger Details
          </h2>

          <div className="alert alert-info">
            Enter the details of each
            passenger. Gender is recorded
            when the ticket is booked.
          </div>

          {passengerDetails.map(
            (
              passenger,
              index
            ) => (
              <div
                className="passenger-box"
                key={passenger.seat}
              >
                <h5>
                  Passenger{" "}
                  {index + 1} — Seat{" "}
                  {passenger.seat}
                </h5>

                <div className="row g-3 mt-1">
                  <div className="col-md-4">
                    <label className="form-label">
                      Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={
                        passenger.name
                      }
                      onChange={(e) =>
                        updatePassenger(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Passenger name"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Age
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      value={
                        passenger.age
                      }
                      onChange={(e) =>
                        updatePassenger(
                          index,
                          "age",
                          e.target.value
                        )
                      }
                      placeholder="Age"
                      min="1"
                      max="100"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Gender
                    </label>

                    <select
                      className="form-select"
                      value={
                        passenger.gender
                      }
                      onChange={(e) =>
                        updatePassenger(
                          index,
                          "gender",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select Gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )
          )}

          <button
            className="btn btn-primary mt-4"
            onClick={
              continueToPayment
            }
          >
            Continue to Payment
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAYMENT
  ========================================================= */

  function renderPayment() {
    const total =
      Number(
        selectedBus?.price || 0
      ) *
      Number(passengers);

    return (
      <div className="container page-container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card shadow p-4">
              <h2 className="text-center mb-4">
                Payment
              </h2>

              <div className="alert alert-success text-center">
                <h4>
                  Total Amount:
                  ₹{total}
                </h4>
              </div>

              <form
                onSubmit={
                  makePayment
                }
              >
                <div className="mb-3">
                  <label className="form-label">
                    Payment Method
                  </label>

                  <select
                    className="form-select"
                    value={
                      paymentMethod
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  >
                    <option value="UPI">
                      UPI
                    </option>

                    <option value="Card">
                      Debit / Credit Card
                    </option>

                    <option value="Net Banking">
                      Net Banking
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Demo Payment Number
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={
                      paymentNumber
                    }
                    onChange={(e) =>
                      setPaymentNumber(
                        e.target.value
                      )
                    }
                    placeholder="Enter demo number"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 btn-lg"
                >
                  Pay ₹{total}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     TICKET
  ========================================================= */

  function renderTicket() {
    if (!booking) {
      return (
        <div className="container page-container">
          <div className="alert alert-warning">
            No ticket available.
          </div>
        </div>
      );
    }

    return (
      <div className="container page-container">
        <div className="card shadow p-4 ticket-card">
          <div className="text-center">
            <div className="ticket-success-icon">
              🎫
            </div>

            <h2>
              Booking Confirmed
            </h2>

            <p className="text-success">
              Your bus ticket has been
              successfully booked.
            </p>
          </div>

          <hr />

          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>
                  Booking ID:
                </strong>{" "}
                {booking.id}
              </p>

              <p>
                <strong>
                  Passenger:
                </strong>{" "}
                {booking.userName}
              </p>

              <p>
                <strong>
                  Bus:
                </strong>{" "}
                {booking.bus.name}
              </p>

              <p>
                <strong>
                  Bus Type:
                </strong>{" "}
                {booking.bus.type}
              </p>

              <p>
                <strong>
                  Route:
                </strong>{" "}
                {booking.source} →{" "}
                {booking.destination}
              </p>
            </div>

            <div className="col-md-6">
              <p>
                <strong>
                  Journey Date:
                </strong>{" "}
                {
                  booking.journeyDate
                }
              </p>

              <p>
                <strong>
                  Departure:
                </strong>{" "}
                {
                  booking.bus
                    .departure
                }
              </p>

              <p>
                <strong>
                  Arrival:
                </strong>{" "}
                {
                  booking.bus
                    .arrival
                }
              </p>

              <p>
                <strong>
                  Payment:
                </strong>{" "}
                {
                  booking.paymentMethod
                }
              </p>

              <p>
                <strong>
                  Total:
                </strong>{" "}
                ₹{booking.total}
              </p>
            </div>
          </div>

          <hr />

          <h4>
            Passenger Details
          </h4>

          {booking.passengers.map(
            (passenger) => (
              <div
                className="passenger-ticket"
                key={
                  passenger.seat
                }
              >
                <strong>
                  {
                    passenger.name
                  }
                </strong>

                <br />

                Age:{" "}
                {
                  passenger.age
                }

                <br />

                Gender:{" "}
                {
                  passenger.gender
                }

                <br />

                Seat:{" "}
                <strong>
                  {
                    passenger.seat
                  }
                </strong>
              </div>
            )
          )}

          <div className="d-flex gap-2 mt-4 flex-wrap">
            <button
              className="btn btn-primary"
              onClick={() =>
                setPage(
                  "myBookings"
                )
              }
            >
              My Bookings
            </button>

            <button
              className="btn btn-success"
              onClick={
                openSearch
              }
            >
              Book Another Bus
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MY BOOKINGS
  ========================================================= */

  function renderMyBookings() {
    const userBookings =
      myBookings.filter(
        (item) =>
          item.userEmail ===
          user?.email
      );

    return (
      <div className="container page-container">
        <h2>
          My Bookings
        </h2>

        {userBookings.length ===
        0 ? (
          <div className="alert alert-info mt-3">
            You have no bookings.
          </div>
        ) : (
          <div className="row g-4 mt-1">
            {userBookings.map(
              (item) => (
                <div
                  className="col-lg-6"
                  key={item.id}
                >
                  <div className="card shadow p-4 h-100">
                    <h5>
                      Booking ID:{" "}
                      {item.id}
                    </h5>

                    <hr />

                    <p>
                      <strong>
                        Bus:
                      </strong>{" "}
                      {
                        item.bus.name
                      }
                    </p>

                    <p>
                      <strong>
                        Type:
                      </strong>{" "}
                      {
                        item.bus.type
                      }
                    </p>

                    <p>
                      <strong>
                        Route:
                      </strong>{" "}
                      {item.source} →{" "}
                      {
                        item.destination
                      }
                    </p>

                    <p>
                      <strong>
                        Date:
                      </strong>{" "}
                      {
                        item.journeyDate
                      }
                    </p>

                    <p>
                      <strong>
                        Seats:
                      </strong>{" "}
                      {item.passengers
                        .map(
                          (
                            passenger
                          ) =>
                            passenger.seat
                        )
                        .join(
                          ", "
                        )}
                    </p>

                    <p>
                      <strong>
                        Total:
                      </strong>{" "}
                      ₹{item.total}
                    </p>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        cancelBooking(
                          item.id
                        )
                      }
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
     ADMIN LOGIN
  ========================================================= */

  function renderAdminLogin() {
    return (
      <div className="auth-page admin-auth-page">
        <div className="container page-container">
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="card shadow p-4">
              <h2 className="text-center mb-4">
                Admin Login
              </h2>

              <form
                onSubmit={
                  handleAdminLogin
                }
              >
                <div className="mb-3">
                  <label className="form-label">
                    Admin Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={
                      adminEmail
                    }
                    onChange={(e) =>
                      setAdminEmail(
                        e.target.value
                      )
                    }
                    placeholder="Admin email"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    value={
                      adminPassword
                    }
                    onChange={(e) =>
                      setAdminPassword(
                        e.target.value
                      )
                    }
                    placeholder="Password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                >
                  Admin Login
                </button>
              </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ADMIN DASHBOARD
  ========================================================= */

  function renderAdminDashboard() {
    const totalPassengers =
      myBookings.reduce(
        (total, item) =>
          total +
          item.passengers.length,
        0
      );

    const totalRevenue =
      myBookings.reduce(
        (total, item) =>
          total +
          Number(item.total),
        0
      );

    return (
      <div className="container page-container">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h2>
            Admin Dashboard
          </h2>

          <button
            className="btn btn-danger"
            onClick={() => {
              setAdminLoggedIn(
                false
              );
              setPage("home");
            }}
          >
            Logout Admin
          </button>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-md-3">
            <div className="card shadow p-4 text-center h-100">
              <h2>
                {buses.length}
              </h2>

              <p className="mb-0">
                Bus Services
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow p-4 text-center h-100">
              <h2>
                {
                  myBookings.length
                }
              </h2>

              <p className="mb-0">
                Total Bookings
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow p-4 text-center h-100">
              <h2>
                {
                  registeredUsers.length
                }
              </h2>

              <p className="mb-0">
                Registered Users
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow p-4 text-center h-100">
              <h2>
                ₹{totalRevenue}
              </h2>

              <p className="mb-0">
                Revenue
              </p>
            </div>
          </div>
        </div>

        <div className="card shadow p-4 mt-4">
          <h4>
            Manage Bus Services
          </h4>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>
                    ID
                  </th>

                  <th>
                    Bus
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Source
                  </th>

                  <th>
                    Destination
                  </th>

                  <th>
                    Departure
                  </th>

                  <th>
                    Duration
                  </th>

                  <th>
                    Price
                  </th>
                </tr>
              </thead>

              <tbody>
                {buses.map(
                  (bus) => (
                    <tr
                      key={
                        bus.id
                      }
                    >
                      <td>
                        {
                          bus.id
                        }
                      </td>

                      <td>
                        {
                          bus.name
                        }
                      </td>

                      <td>
                        {
                          bus.type
                        }
                      </td>

                      <td>
                        {
                          bus.source
                        }
                      </td>

                      <td>
                        {
                          bus.destination
                        }
                      </td>

                      <td>
                        {
                          bus.departure
                        }
                      </td>

                      <td>
                        {
                          bus.duration
                        }
                      </td>

                      <td>
                        ₹
                        {
                          bus.price
                        }
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card shadow p-4 mt-4">
          <h4>
            Registered Users
          </h4>

          {registeredUsers.length ===
          0 ? (
            <p>
              No registered users.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>
                      Name
                    </th>

                    <th>
                      Phone
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {registeredUsers.map(
                    (registeredUser) => (
                      <tr
                        key={
                          registeredUser.id
                        }
                      >
                        <td>
                          {
                            registeredUser.name
                          }
                        </td>

                        <td>
                          {
                            registeredUser.phone
                          }
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card shadow p-4 mt-4">
          <h4>
            Recent Bookings
          </h4>

          {myBookings.length ===
          0 ? (
            <p>
              No bookings yet.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>
                      Booking ID
                    </th>

                    <th>
                      User
                    </th>

                    <th>
                      Bus
                    </th>

                    <th>
                      Route
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Passengers
                    </th>

                    <th>
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {myBookings.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                      >
                        <td>
                          {
                            item.id
                          }
                        </td>

                        <td>
                          {
                            item.userName
                          }
                        </td>

                        <td>
                          {
                            item.bus
                              .name
                          }
                        </td>

                        <td>
                          {
                            item.source
                          }{" "}
                          →{" "}
                          {
                            item.destination
                          }
                        </td>

                        <td>
                          {
                            item.journeyDate
                          }
                        </td>

                        <td>
                          {
                            item.passengers
                              .length
                          }
                        </td>

                        <td>
                          ₹
                          {
                            item.total
                          }
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================
     NAVBAR
  ========================================================= */

  function renderNavbar() {
    return (
      <>
        {loggedIn && user?.name ? (
          <div
            className="text-center py-2"
            style={{
              backgroundColor: "#0d6efd",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "1.15rem",
              letterSpacing: "0.2px"
            }}
          >
            Hi {user.name}, WELCOME!
          </div>
        ) : null}

        <nav
          className="navbar navbar-expand-lg navbar-dark sticky-top"
          style={{ backgroundColor: "#0d6efd" }}
        >
          <div className="container">
            <button
              className="navbar-brand btn btn-link text-white text-decoration-none"
              onClick={
                goHome
              }
            >
              🚌 Smart Bus
            </button>

            <div className="d-flex flex-wrap gap-2">
              <button
                className="nav-btn"
                onClick={
                  goHome
                }
              >
                Home
              </button>

              {loggedIn ? (
                <>
                  <button
                    className="nav-btn"
                    onClick={
                      openSearch
                    }
                  >
                    Search Bus
                  </button>

                  <button
                    className="nav-btn"
                    onClick={openMyBookings}
                  >
                    My Bookings
                  </button>

                  <button
                    className="nav-btn"
                    onClick={
                      logout
                    }
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="nav-btn"
                    onClick={() =>
                      setPage(
                        "login"
                      )
                    }
                  >
                    Login
                  </button>

                  <button
                    className="nav-btn"
                    onClick={() =>
                      setPage(
                        "signup"
                      )
                    }
                  >
                    Sign Up
                  </button>
                </>
              )}

              <button
                className="nav-btn"
                onClick={() =>
                  setPage(
                    "adminLogin"
                  )
                }
              >
                Admin
              </button>
            </div>
          </div>
        </nav>
      </>
    );
  }

  /* =========================================================
     CURRENT PAGE
  ========================================================= */

  function renderCurrentPage() {
    if (page === "home") {
      return renderHome();
    }

    if (page === "login") {
      return renderLogin();
    }

    if (page === "forgotPassword") {
      return renderForgotPassword();
    }

    if (page === "signup") {
      return renderSignup();
    }

    if (page === "search") {
      return renderSearch();
    }

    if (page === "results") {
      return renderResults();
    }

    if (page === "seats") {
      return renderSeats();
    }

    if (page === "passengers") {
      return renderPassengerDetails();
    }

    if (page === "payment") {
      return renderPayment();
    }

    if (page === "ticket") {
      return renderTicket();
    }

    if (page === "myBookings") {
      return renderMyBookings();
    }

    if (page === "adminLogin") {
      return renderAdminLogin();
    }

    if (
      page ===
      "adminDashboard"
    ) {
      if (adminLoggedIn) {
        return renderAdminDashboard();
      }

      return renderAdminLogin();
    }

    return renderHome();
  }

  /* =========================================================
     FINAL APP
  ========================================================= */

  return (
    <>
      {renderNavbar()}

      {renderCurrentPage()}

      <footer className="bg-dark text-white text-center p-4 mt-5">
        <p className="mb-0">
          Smart Bus Reservation
          System
        </p>

        <small>
          React + Bootstrap
        </small>
      </footer>
    </>
  );

}

export default App;
