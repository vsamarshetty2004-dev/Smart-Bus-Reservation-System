/* =====================================================
   SMART BUS RESERVATION SYSTEM
   script.js
===================================================== */


/* =====================================================
   BACKEND URL
===================================================== */

const API_URL = "http://localhost:8080/SmartBusReservation";


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let currentUser = null;

let selectedBus = null;

let selectedSeats = [];

let passengerCount = 0;

let passengerDetails = [];

let currentBooking = null;

let selectedJourney = {
    source: "",
    destination: "",
    date: ""
};


/* =====================================================
   DEMO BUS DATA
   This is temporary for frontend testing.
   Later this will come from Java + MySQL.
===================================================== */

const buses = [

    {
        id: 1,
        name: "VRL Travels",
        number: "KA-25-B-1234",
        source: "Dharwad",
        destination: "Bengaluru",
        departure: "08:30 AM",
        arrival: "04:00 PM",
        duration: "7h 30m",
        price: 650,
        totalSeats: 32
    },

    {
        id: 2,
        name: "KSRTC Express",
        number: "KA-01-F-5678",
        source: "Dharwad",
        destination: "Bengaluru",
        departure: "10:00 AM",
        arrival: "06:00 PM",
        duration: "8h",
        price: 580,
        totalSeats: 40
    },

    {
        id: 3,
        name: "Airavat Bus",
        number: "KA-01-AB-2345",
        source: "Hubballi",
        destination: "Bengaluru",
        departure: "09:00 AM",
        arrival: "04:30 PM",
        duration: "7h 30m",
        price: 720,
        totalSeats: 40
    },

    {
        id: 4,
        name: "North Karnataka Express",
        number: "KA-26-C-7890",
        source: "Belagavi",
        destination: "Bengaluru",
        departure: "07:30 AM",
        arrival: "03:30 PM",
        duration: "8h",
        price: 700,
        totalSeats: 40
    },

    {
        id: 5,
        name: "VRL Superfast",
        number: "KA-27-D-4567",
        source: "Gadag",
        destination: "Bengaluru",
        departure: "06:30 AM",
        arrival: "03:00 PM",
        duration: "8h 30m",
        price: 620,
        totalSeats: 32
    },

    {
        id: 6,
        name: "KSRTC Rajahamsa",
        number: "KA-05-R-3456",
        source: "Mysuru",
        destination: "Bengaluru",
        departure: "09:30 AM",
        arrival: "12:30 PM",
        duration: "3h",
        price: 450,
        totalSeats: 40
    },

    {
        id: 7,
        name: "Coastal Express",
        number: "KA-20-E-6789",
        source: "Mangaluru",
        destination: "Bengaluru",
        departure: "08:00 AM",
        arrival: "02:30 PM",
        duration: "6h 30m",
        price: 680,
        totalSeats: 40
    },

    {
        id: 8,
        name: "City Express",
        number: "KA-41-X-9999",
        source: "Hubballi",
        destination: "Mysuru",
        departure: "07:00 AM",
        arrival: "03:00 PM",
        duration: "8h",
        price: 750,
        totalSeats: 40
    }

];


/* =====================================================
   DEMO OCCUPIED SEATS
   Temporary frontend data.
===================================================== */

const occupiedSeats = {

    1: {
        "A1": "Female",
        "B2": "Male",
        "C3": "Female",
        "D4": "Male"
    },

    2: {
        "A2": "Female",
        "C1": "Male",
        "D3": "Female"
    },

    3: {
        "B1": "Female",
        "C4": "Male",
        "E2": "Female"
    },

    4: {
        "A3": "Male",
        "B4": "Female"
    },

    5: {
        "C2": "Female",
        "D1": "Male"
    },

    6: {
        "A1": "Female",
        "A4": "Male"
    },

    7: {
        "B2": "Female",
        "C3": "Male"
    },

    8: {
        "D2": "Female",
        "E4": "Male"
    }

};


/* =====================================================
   ALTERNATIVE ROUTES
===================================================== */

const nearbyPlaces = {

    "Dharwad": [
        "Hubballi",
        "Belagavi",
        "Gadag"
    ],

    "Hubballi": [
        "Dharwad",
        "Gadag",
        "Belagavi"
    ],

    "Gadag": [
        "Hubballi",
        "Dharwad",
        "Ballari"
    ],

    "Belagavi": [
        "Hubballi",
        "Dharwad",
        "Bagalkot"
    ],

    "Mysuru": [
        "Mandya",
        "Hassan",
        "Bengaluru"
    ],

    "Mangaluru": [
        "Udupi",
        "Hassan",
        "Madikeri"
    ]

};


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {

        page.classList.remove("active-page");

    });


    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {

        selectedPage.classList.add("active-page");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /*
       If My Bookings is opened,
       refresh the bookings.
    */

    if (pageId === "myBookings") {

        displayMyBookings();

    }


    /*
       If Admin is opened,
       refresh dashboard.
    */

    if (pageId === "admin") {

        loadAdminDashboard();

    }

}


/* =====================================================
   INITIAL PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    showPage("home");

    setMinimumJourneyDate();

    updateNavigation();

});


/* =====================================================
   SET MINIMUM JOURNEY DATE
===================================================== */

function setMinimumJourneyDate() {

    const dateInput = document.getElementById("journeyDate");

    if (!dateInput) {
        return;
    }


    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;

}


/* =====================================================
   SIGN UP
===================================================== */

async function signupUser(event) {

    event.preventDefault();


    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim();

    const phone =
        document.getElementById("signupPhone").value.trim();

    const city =
        document.getElementById("signupCity").value.trim();

    const password =
        document.getElementById("signupPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }


    if (password.length < 6) {

        alert("Password must contain at least 6 characters.");

        return;

    }


    /*
       First try Java backend.
    */

    try {

        const response = await fetch(
            API_URL + "/api/auth/signup",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    city: city,
                    password: password
                })
            }
        );


        if (response.ok) {

            const data = await response.json();

            alert(
                data.message ||
                "Account created successfully!"
            );

            clearSignupForm();

            showPage("login");

            return;

        }

    } catch (error) {

        console.log(
            "Backend unavailable. Using demo signup."
        );

    }


    /*
       Temporary frontend demo.
    */

    const users =
        JSON.parse(
            localStorage.getItem("smartBusUsers") || "[]"
        );


    const existingUser =
        users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );


    if (existingUser) {

        alert("An account with this email already exists.");

        return;

    }


    users.push({

        id: Date.now(),

        name: name,

        email: email,

        phone: phone,

        city: city,

        password: password,

        role: "user"

    });


    localStorage.setItem(
        "smartBusUsers",
        JSON.stringify(users)
    );


    alert("Account created successfully!");


    clearSignupForm();

    showPage("login");

}


/* =====================================================
   CLEAR SIGNUP
===================================================== */

function clearSignupForm() {

    document.getElementById("signupName").value = "";

    document.getElementById("signupEmail").value = "";

    document.getElementById("signupPhone").value = "";

    document.getElementById("signupCity").value = "";

    document.getElementById("signupPassword").value = "";

    document.getElementById("confirmPassword").value = "";

}


/* =====================================================
   LOGIN
===================================================== */

async function loginUser(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    if (!email || !password) {

        alert("Please enter email and password.");

        return;

    }


    /*
       Try Java backend.
    */

    try {

        const response = await fetch(
            API_URL + "/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        if (response.ok) {

            const data = await response.json();

            currentUser =
                data.user || data;


            localStorage.setItem(
                "smartBusCurrentUser",
                JSON.stringify(currentUser)
            );


            alert("Login successful!");

            updateNavigation();

            clearLoginForm();

            showPage("home");

            return;

        }

    } catch (error) {

        console.log(
            "Backend unavailable. Using demo login."
        );

    }


    /*
       Temporary frontend login.
    */

    const users =
        JSON.parse(
            localStorage.getItem("smartBusUsers") || "[]"
        );


    /*
       Demo admin account
    */

    if (
        email.toLowerCase() === "admin@gmail.com" &&
        password === "admin123"
    ) {

        currentUser = {

            name: "Administrator",

            email: "admin@gmail.com",

            role: "admin"

        };


        localStorage.setItem(
            "smartBusCurrentUser",
            JSON.stringify(currentUser)
        );


        alert("Admin login successful!");

        updateNavigation();

        clearLoginForm();

        showPage("admin");

        return;

    }


    const user =
        users.find(
            item =>
                item.email.toLowerCase() ===
                email.toLowerCase() &&
                item.password === password
        );


    if (!user) {

        alert("Invalid email or password.");

        return;

    }


    currentUser = user;


    localStorage.setItem(
        "smartBusCurrentUser",
        JSON.stringify(currentUser)
    );


    alert("Login successful!");


    updateNavigation();

    clearLoginForm();

    showPage("home");

}


/* =====================================================
   CLEAR LOGIN
===================================================== */

function clearLoginForm() {

    const email =
        document.getElementById("loginEmail");

    const password =
        document.getElementById("loginPassword");


    if (email) {
        email.value = "";
    }


    if (password) {
        password.value = "";
    }

}


/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {

    currentUser = null;

    localStorage.removeItem(
        "smartBusCurrentUser"
    );


    updateNavigation();

    alert("You have been logged out.");

    showPage("home");

}


/* =====================================================
   UPDATE NAVIGATION
===================================================== */

function updateNavigation() {

    const loginLink =
        document.getElementById("loginLink");

    const signupLink =
        document.getElementById("signupLink");

    const adminNav =
        document.getElementById("adminNav");

    const logoutLink =
        document.getElementById("logoutLink");


    const savedUser =
        localStorage.getItem("smartBusCurrentUser");


    if (savedUser) {

        try {

            currentUser = JSON.parse(savedUser);

        } catch (error) {

            currentUser = null;

        }

    }


    if (currentUser) {

        if (loginLink) {
            loginLink.style.display = "none";
        }

        if (signupLink) {
            signupLink.style.display = "none";
        }

        if (logoutLink) {
            logoutLink.style.display = "block";
        }


        if (
            adminNav &&
            currentUser.role === "admin"
        ) {

            adminNav.style.display = "block";

        } else if (adminNav) {

            adminNav.style.display = "none";

        }

    } else {

        if (loginLink) {
            loginLink.style.display = "block";
        }

        if (signupLink) {
            signupLink.style.display = "block";
        }

        if (adminNav) {
            adminNav.style.display = "none";
        }

        if (logoutLink) {
            logoutLink.style.display = "none";
        }

    }

}


/* =====================================================
   FORGOT PASSWORD
===================================================== */

async function resetPassword() {

    const email =
        document.getElementById("forgotEmail")
            .value.trim();

    const newPassword =
        document.getElementById("newPassword")
            .value;

    const confirmPassword =
        document.getElementById("confirmNewPassword")
            .value;


    if (!email || !newPassword || !confirmPassword) {

        alert("Please fill all fields.");

        return;

    }


    if (newPassword !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }


    if (newPassword.length < 6) {

        alert("Password must contain at least 6 characters.");

        return;

    }


    /*
       Try backend.
    */

    try {

        const response = await fetch(
            API_URL + "/api/auth/forgot-password",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    newPassword: newPassword
                })
            }
        );


        const data = await response.json();


        if (response.ok) {

            alert(
                data.message ||
                "Password updated successfully!"
            );


            clearForgotPasswordForm();

            showPage("login");

            return;

        }


        if (response.status !== 404) {

            alert(
                data.message ||
                "Unable to update password."
            );

            return;

        }

    } catch (error) {

        console.log(
            "Backend unavailable. Using demo reset."
        );

    }


    /*
       Temporary frontend reset.
    */

    const users =
        JSON.parse(
            localStorage.getItem("smartBusUsers") || "[]"
        );


    const userIndex =
        users.findIndex(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );


    if (userIndex === -1) {

        alert("Email address is not registered.");

        return;

    }


    users[userIndex].password = newPassword;


    localStorage.setItem(
        "smartBusUsers",
        JSON.stringify(users)
    );


    alert("Password updated successfully!");


    clearForgotPasswordForm();

    showPage("login");

}


/* =====================================================
   CLEAR FORGOT PASSWORD
===================================================== */

function clearForgotPasswordForm() {

    document.getElementById("forgotEmail").value = "";

    document.getElementById("newPassword").value = "";

    document.getElementById("confirmNewPassword").value = "";

}


/* =====================================================
   TOGGLE PASSWORD
===================================================== */

function togglePassword(inputId, icon) {

    const input =
        document.getElementById(inputId);


    if (!input) {
        return;
    }


    if (input.type === "password") {

        input.type = "text";

        icon.textContent = "🙈";

    } else {

        input.type = "password";

        icon.textContent = "👁️";

    }

}


/* =====================================================
   SEARCH BUSES
===================================================== */

function searchBuses(event) {

    event.preventDefault();


    const source =
        document.getElementById("source")
            .value.trim();

    const destination =
        document.getElementById("destination")
            .value.trim();

    const journeyDate =
        document.getElementById("journeyDate")
            .value;

    passengerCount =
        parseInt(
            document.getElementById("passengers")
                .value
        );


    if (!source || !destination) {

        alert(
            "Please enter source and destination."
        );

        return;

    }


    if (!journeyDate) {

        alert(
            "Please select journey date."
        );

        return;

    }


    if (!passengerCount || passengerCount < 1) {

        alert(
            "Please select number of passengers."
        );

        return;

    }


    if (
        source.toLowerCase() ===
        destination.toLowerCase()
    ) {

        alert(
            "Source and destination cannot be the same."
        );

        return;

    }


    selectedJourney = {

        source: source,

        destination: destination,

        date: journeyDate

    };


    const results =
        buses.filter(
            bus =>
                bus.source.toLowerCase() ===
                source.toLowerCase() &&
                bus.destination.toLowerCase() ===
                destination.toLowerCase()
        );


    const busResults =
        document.getElementById("busResults");


    const alternativeRoutes =
        document.getElementById(
            "alternativeRoutes"
        );


    busResults.innerHTML = "";

    alternativeRoutes.innerHTML = "";


    /*
       DIRECT BUS AVAILABLE
    */

    if (results.length > 0) {

        busResults.innerHTML = `

            <div class="mb-4">

                <h3 class="text-center">
                    🚌 Available Buses
                </h3>

                <p class="text-center text-muted">
                    ${results.length}
                    bus${results.length > 1 ? "es" : ""}
                    found from
                    <strong>${source}</strong>
                    to
                    <strong>${destination}</strong>.
                </p>

            </div>

        `;


        results.forEach(function(bus) {

            busResults.innerHTML += createBusCard(bus);

        });


        showPage("searchBus");

        return;

    }


    /*
       NO DIRECT BUS
    */

    busResults.innerHTML = `

        <div class="no-bus-box">

            <div style="font-size:50px;">
                🚌
            </div>

            <h3>
                No Direct Bus Found
            </h3>

            <p>
                We couldn't find a direct bus from
                <strong>${source}</strong>
                to
                <strong>${destination}</strong>.
            </p>

            <p>
                Don't worry! Our smart system will
                search nearby places for an alternative route.
            </p>

        </div>

    `;


    findAlternativeRoutes(
        source,
        destination,
        journeyDate
    );


    showPage("searchBus");

}


/* =====================================================
   CREATE BUS CARD
===================================================== */

function createBusCard(bus) {

    const availableSeats =
        getAvailableSeatCount(bus.id, bus.totalSeats);


    return `

        <div class="bus-card">

            <div class="row align-items-center">

                <div class="col-md-7">

                    <h4>
                        🚌 ${bus.name}
                    </h4>

                    <p class="mb-1">

                        <strong>
                            ${bus.number}
                        </strong>

                    </p>

                    <div class="bus-route">

                        📍 ${bus.source}

                        &nbsp; → &nbsp;

                        📍 ${bus.destination}

                    </div>

                    <div class="bus-info">

                        ⏰ ${bus.departure}
                        -
                        ${bus.arrival}

                        <br>

                        ⏱️ ${bus.duration}

                        <br>

                        💺 ${availableSeats}
                        seats available

                    </div>

                </div>


                <div class="col-md-5 text-md-end mt-3 mt-md-0">

                    <div class="bus-price mb-2">

                        ₹${bus.price}

                    </div>

                    <small class="text-muted">
                        per passenger
                    </small>

                    <br><br>

                    <button
                        class="btn btn-primary"
                        onclick="selectBus(${bus.id})">

                        Select Bus

                    </button>

                </div>

            </div>

        </div>

    `;

}


/* =====================================================
   FIND ALTERNATIVE ROUTES
===================================================== */

function findAlternativeRoutes(
    source,
    destination,
    journeyDate
) {

    const alternativeContainer =
        document.getElementById(
            "alternativeRoutes"
        );


    let places =
        nearbyPlaces[source] || [];


    /*
       Find buses whose destination
       matches user's destination.
    */

    let alternatives = [];


    places.forEach(function(place) {

        const matchingBuses =
            buses.filter(
                bus =>
                    bus.source.toLowerCase() ===
                    place.toLowerCase() &&
                    bus.destination.toLowerCase() ===
                    destination.toLowerCase()
            );


        matchingBuses.forEach(function(bus) {

            alternatives.push({

                place: place,

                bus: bus

            });

        });

    });


    /*
       If no predefined nearby place works,
       find other buses going to destination.
    */

    if (alternatives.length === 0) {

        const otherBuses =
            buses.filter(
                bus =>
                    bus.destination.toLowerCase() ===
                    destination.toLowerCase() &&
                    bus.source.toLowerCase() !==
                    source.toLowerCase()
            );


        otherBuses.forEach(function(bus) {

            alternatives.push({

                place: bus.source,

                bus: bus

            });

        });

    }


    /*
       Remove duplicates.
    */

    const unique = [];


    alternatives.forEach(function(item) {

        const exists =
            unique.some(
                x => x.bus.id === item.bus.id
            );


        if (!exists) {

            unique.push(item);

        }

    });


    if (unique.length === 0) {

        alternativeContainer.innerHTML = `

            <div class="alert alert-warning">

                <strong>
                    No alternative route found.
                </strong>

                <br>

                Please try another source or destination.

            </div>

        `;

        return;

    }


    /*
       Limit to 3 recommendations.
    */

    const recommendations =
        unique.slice(0, 3);


    let html = `

        <div class="alternative-route-box">

            <h3>
                🧭 Smart Alternative Route Recommendation
            </h3>

            <p>

                Since there is no direct bus from
                <strong>${source}</strong>
                to
                <strong>${destination}</strong>,

                you can travel from a nearby
                available boarding place.

            </p>

    `;


    recommendations.forEach(
        function(item, index) {

            const bus = item.bus;

            const recommended =
                index === 0;


            html += `

                <div class="
                    alternative-route
                    ${recommended ? "recommended-route" : ""}
                ">

                    ${
                        recommended
                        ?
                        `
                        <span class="recommended-badge">
                            🥇 Recommended
                        </span>
                        `
                        :
                        ""
                    }


                    <h4>

                        📍 ${item.place}
                        → ${destination}

                    </h4>


                    <p>

                        🚌 <strong>
                            ${bus.name}
                        </strong>

                        <br>

                        🆔 ${bus.number}

                        <br>

                        ⏰ ${bus.departure}
                        -
                        ${bus.arrival}

                        <br>

                        ⏱️ ${bus.duration}

                        <br>

                        💺
                        ${getAvailableSeatCount(
                            bus.id,
                            bus.totalSeats
                        )}
                        seats available

                    </p>


                    <div class="d-flex
                                justify-content-between
                                align-items-center
                                flex-wrap">

                        <strong class="bus-price">

                            ₹${bus.price}

                        </strong>


                        <button
                            class="btn btn-primary mt-2"
                            onclick="searchAlternativeRoute(
                                '${item.place}',
                                '${destination}',
                                '${journeyDate}'
                            )">

                            Search This Route

                        </button>

                    </div>

                </div>

            `;

        }
    );


    html += `

        </div>

    `;


    alternativeContainer.innerHTML = html;

}


/* =====================================================
   SEARCH ALTERNATIVE ROUTE
===================================================== */

function searchAlternativeRoute(
    place,
    destination = selectedJourney.destination,
    journeyDate = selectedJourney.date
) {

    document.getElementById("source").value =
        place;

    document.getElementById("destination").value =
        destination;


    if (journeyDate) {

        document.getElementById("journeyDate").value =
            journeyDate;

    }


    document.getElementById("passengers").value =
        passengerCount || "1";


    const fakeEvent = {

        preventDefault: function() {}

    };


    searchBuses(fakeEvent);

}


/* =====================================================
   SELECT BUS
===================================================== */

function selectBus(busId) {

    selectedBus =
        buses.find(
            bus => bus.id === busId
        );


    if (!selectedBus) {

        alert("Bus information not found.");

        return;

    }


    const availableSeats =
        getAvailableSeatCount(
            selectedBus.id,
            selectedBus.totalSeats
        );


    if (availableSeats < passengerCount) {

        alert(
            "This bus does not have enough seats for " +
            passengerCount +
            " passenger(s)."
        );

        return;

    }


    selectedSeats = [];

    passengerDetails = [];


    document.getElementById(
        "selectedBusName"
    ).textContent =
        selectedBus.name;


    document.getElementById(
        "selectedBusRoute"
    ).textContent =
        selectedBus.source +
        " → " +
        selectedBus.destination;


    document.getElementById(
        "selectedPassengerCount"
    ).textContent =
        passengerCount;


    document.getElementById(
        "selectedSeat"
    ).value = "";


    document.getElementById(
        "seatMessage"
    ).innerHTML = "";


    generateSeats();


    showPage("seatSelection");

}


/* =====================================================
   GENERATE SEATS
===================================================== */

function generateSeats() {

    const container =
        document.getElementById(
            "seatContainer"
        );


    container.innerHTML = "";


    if (!selectedBus) {
        return;
    }


    const seatLetters = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H"
    ];


    const seatsPerRow = 4;


    const totalRows =
        Math.ceil(
            selectedBus.totalSeats /
            seatsPerRow
        );


    for (
        let rowIndex = 0;
        rowIndex < totalRows;
        rowIndex++
    ) {

        const row =
            document.createElement("div");


        row.className = "seat-row";


        for (
            let seatNumber = 1;
            seatNumber <= seatsPerRow;
            seatNumber++
        ) {

            const seatId =
                seatLetters[rowIndex] +
                seatNumber;


            const actualSeatNumber =
                rowIndex * seatsPerRow +
                seatNumber;


            if (
                actualSeatNumber >
                selectedBus.totalSeats
            ) {

                continue;

            }


            const seat =
                document.createElement("div");


            seat.className =
                "seat available";


            seat.textContent =
                seatId;


            seat.dataset.seat =
                seatId;


            /*
               Add occupied seat status.
            */

            const status =
                getSeatStatus(
                    selectedBus.id,
                    seatId
                );


            if (status === "Female") {

                seat.className =
                    "seat female";

                seat.title =
                    "Female occupied seat";

            }


            else if (status === "Male") {

                seat.className =
                    "seat male";

                seat.title =
                    "Male occupied seat";

            }


            else {

                seat.addEventListener(
                    "click",
                    function() {

                        selectSeat(
                            seatId,
                            seat
                        );

                    }
                );

            }


            row.appendChild(seat);

        }


        container.appendChild(row);

    }

}


/* =====================================================
   GET SEAT STATUS
===================================================== */

function getSeatStatus(busId, seatId) {

    if (
        occupiedSeats[busId] &&
        occupiedSeats[busId][seatId]
    ) {

        return occupiedSeats[busId][seatId];

    }


    return null;

}


/* =====================================================
   SELECT SEAT
===================================================== */

function selectSeat(
    seatId,
    seatElement
) {

    /*
       If already selected,
       remove it.
    */

    if (
        selectedSeats.includes(seatId)
    ) {

        selectedSeats =
            selectedSeats.filter(
                seat => seat !== seatId
            );


        seatElement.classList.remove(
            "selected"
        );


        updateSelectedSeatsDisplay();

        return;

    }


    /*
       Check passenger limit.
    */

    if (
        selectedSeats.length >=
        passengerCount
    ) {

        showSeatMessage(
            "You can select only " +
            passengerCount +
            " seat(s).",
            "danger"
        );

        return;

    }


    /*
       Determine passenger gender
       if details have already been entered.
    */

    const passengerIndex =
        selectedSeats.length;


    const passengerGender =
        passengerDetails[
            passengerIndex
        ]?.gender || null;


    /*
       If gender is already known,
       apply female/male adjacency rule.
    */

    if (passengerGender) {

        if (
            !checkGenderSeatRestriction(
                seatId,
                passengerGender
            )
        ) {

            return;

        }

    }


    /*
       Select the seat.
    */

    selectedSeats.push(seatId);


    seatElement.classList.add(
        "selected"
    );


    updateSelectedSeatsDisplay();


    /*
       Inform user.
    */

    showSeatMessage(
        selectedSeats.length +
        " of " +
        passengerCount +
        " seat(s) selected.",
        "success"
    );

}


/* =====================================================
   UPDATE SELECTED SEATS
===================================================== */

function updateSelectedSeatsDisplay() {

    const input =
        document.getElementById(
            "selectedSeat"
        );


    if (!input) {
        return;
    }


    input.value =
        selectedSeats.join(", ");

}


/* =====================================================
   SHOW SEAT MESSAGE
===================================================== */

function showSeatMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "seatMessage"
        );


    if (!element) {
        return;
    }


    element.innerHTML = `

        <div class="alert alert-${type} py-2">

            ${message}

        </div>

    `;

}


/* =====================================================
   GET ADJACENT SEATS
===================================================== */

function getAdjacentSeats(seatId) {

    /*
       Example:

       A1 -> A2
       A2 -> A1, A3
       A3 -> A2, A4
       A4 -> A3

       This treats seats in the same row
       as adjacent.
    */


    const row =
        seatId.charAt(0);


    const number =
        parseInt(
            seatId.substring(1)
        );


    const adjacent = [];


    if (number > 1) {

        adjacent.push(
            row + (number - 1)
        );

    }


    if (number < 4) {

        adjacent.push(
            row + (number + 1)
        );

    }


    return adjacent;

}


/* =====================================================
   GENDER SEAT RESTRICTION
===================================================== */

function checkGenderSeatRestriction(
    seatId,
    gender
) {

    const adjacentSeats =
        getAdjacentSeats(seatId);


    /*
       Check already occupied seats.
    */

    for (
        const adjacent of adjacentSeats
    ) {

        const status =
            getSeatStatus(
                selectedBus.id,
                adjacent
            );


        /*
           Male cannot sit beside female.
        */

        if (
            gender === "Male" &&
            status === "Female"
        ) {

            showSeatMessage(
                "🚫 This seat cannot be selected by a male passenger because it is beside a female passenger.",
                "danger"
            );

            return false;

        }


        /*
           Also prevent a female passenger
           from being placed beside an occupied male.
           This keeps the rule safe in both directions.
        */

        if (
            gender === "Female" &&
            status === "Male"
        ) {

            showSeatMessage(
                "🚫 This seat cannot be selected because it is beside a male passenger.",
                "danger"
            );

            return false;

        }

    }


    /*
       Check seats selected during
       the current booking.
    */

    for (
        const selectedSeat of selectedSeats
    ) {

        const index =
            selectedSeats.indexOf(
                selectedSeat
            );


        const selectedGender =
            passengerDetails[index]?.gender;


        if (!selectedGender) {
            continue;
        }


        if (
            adjacentSeats.includes(
                selectedSeat
            )
        ) {

            if (
                gender === "Male" &&
                selectedGender === "Female"
            ) {

                showSeatMessage(
                    "🚫 Male and female passengers cannot select adjacent seats.",
                    "danger"
                );

                return false;

            }


            if (
                gender === "Female" &&
                selectedGender === "Male"
            ) {

                showSeatMessage(
                    "🚫 Male and female passengers cannot select adjacent seats.",
                    "danger"
                );

                return false;

            }

        }

    }


    return true;

}


/* =====================================================
   CONTINUE TO BOOKING
===================================================== */

function continueToBooking() {

    if (!selectedBus) {

        alert("Please select a bus first.");

        return;

    }


    if (
        selectedSeats.length !==
        passengerCount
    ) {

        alert(
            "Please select exactly " +
            passengerCount +
            " seat(s)."
        );

        return;

    }


    /*
       Generate passenger forms.
    */

    generatePassengerForms();


    /*
       Show booking summary.
    */

    updateBookingSummary();


    showPage("booking");

}


/* =====================================================
   GENERATE PASSENGER FORMS
===================================================== */

function generatePassengerForms() {

    const container =
        document.getElementById(
            "passengerDetailsContainer"
        );


    container.innerHTML = "";


    for (
        let i = 0;
        i < passengerCount;
        i++
    ) {

        const previous =
            passengerDetails[i] || {};


        const seat =
            selectedSeats[i];


        container.innerHTML += `

            <div class="passenger-card">

                <h5>
                    👤 Passenger ${i + 1}
                </h5>


                <div class="passenger-seat">

                    💺 Seat:
                    ${seat}

                </div>


                <div class="row">


                    <!-- NAME -->

                    <div class="col-md-6 mb-3">

                        <label class="form-label">

                            Passenger Name

                        </label>

                        <input
                            type="text"
                            class="form-control passenger-name"
                            data-index="${i}"
                            value="${escapeHtml(
                                previous.name || ""
                            )}"
                            placeholder="Enter passenger name"
                            required>

                    </div>


                    <!-- AGE -->

                    <div class="col-md-6 mb-3">

                        <label class="form-label">

                            Age

                        </label>

                        <input
                            type="number"
                            class="form-control passenger-age"
                            data-index="${i}"
                            value="${previous.age || ""}"
                            min="1"
                            max="120"
                            placeholder="Enter age"
                            required>

                    </div>


                    <!-- GENDER -->

                    <div class="col-md-6 mb-3">

                        <label class="form-label">

                            Gender

                        </label>

                        <select
                            class="form-select passenger-gender"
                            data-index="${i}"
                            required>

                            <option value="">
                                Select Gender
                            </option>

                            <option
                                value="Male"
                                ${
                                    previous.gender === "Male"
                                    ? "selected"
                                    : ""
                                }>

                                Male

                            </option>

                            <option
                                value="Female"
                                ${
                                    previous.gender === "Female"
                                    ? "selected"
                                    : ""
                                }>

                                Female

                            </option>

                            <option
                                value="Other"
                                ${
                                    previous.gender === "Other"
                                    ? "selected"
                                    : ""
                                }>

                                Other

                            </option>

                        </select>

                    </div>

                </div>

            </div>

        `;

    }


    /*
       Listen for gender changes.
    */

    const genderInputs =
        document.querySelectorAll(
            ".passenger-gender"
        );


    genderInputs.forEach(function(input) {

        input.addEventListener(
            "change",
            function() {

                updatePassengerDetailsFromForm();

            }
        );

    });

}


/* =====================================================
   UPDATE PASSENGER DETAILS
===================================================== */

function updatePassengerDetailsFromForm() {

    const names =
        document.querySelectorAll(
            ".passenger-name"
        );

    const ages =
        document.querySelectorAll(
            ".passenger-age"
        );

    const genders =
        document.querySelectorAll(
            ".passenger-gender"
        );


    passengerDetails = [];


    for (
        let i = 0;
        i < passengerCount;
        i++
    ) {

        passengerDetails.push({

            name:
                names[i]?.value.trim() || "",

            age:
                ages[i]?.value || "",

            gender:
                genders[i]?.value || "",

            seat:
                selectedSeats[i] || ""

        });

    }

}


/* =====================================================
   CONFIRM BOOKING
===================================================== */

function confirmBooking(event) {

    event.preventDefault();


    updatePassengerDetailsFromForm();


    /*
       Validate passenger details.
    */

    for (
        let i = 0;
        i < passengerDetails.length;
        i++
    ) {

        const passenger =
            passengerDetails[i];


        if (
            !passenger.name ||
            !passenger.age ||
            !passenger.gender
        ) {

            alert(
                "Please complete details for Passenger " +
                (i + 1) +
                "."
            );

            return;

        }

    }


    /*
       Validate gender-seat restriction again.
    */

    for (
        let i = 0;
        i < passengerDetails.length;
        i++
    ) {

        const passenger =
            passengerDetails[i];


        if (
            passenger.gender === "Male" ||
            passenger.gender === "Female"
        ) {

            /*
               Check adjacent seats.
            */

            const adjacent =
                getAdjacentSeats(
                    passenger.seat
                );


            for (
                const adjacentSeat of adjacent
            ) {

                const occupiedGender =
                    getSeatStatus(
                        selectedBus.id,
                        adjacentSeat
                    );


                if (
                    (
                        passenger.gender === "Male" &&
                        occupiedGender === "Female"
                    )
                    ||
                    (
                        passenger.gender === "Female" &&
                        occupiedGender === "Male"
                    )
                ) {

                    alert(
                        "Seat " +
                        passenger.seat +
                        " cannot be booked because it is beside an occupied " +
                        occupiedGender.toLowerCase() +
                        " seat."
                    );

                    return;

                }

            }

        }

    }


    /*
       Create booking object.
    */

    currentBooking = {

        id:
            "SB" +
            Date.now(),

        userEmail:
            currentUser?.email || "guest",

        busId:
            selectedBus.id,

        busName:
            selectedBus.name,

        busNumber:
            selectedBus.number,

        source:
            selectedBus.source,

        destination:
            selectedBus.destination,

        date:
            selectedJourney.date,

        departure:
            selectedBus.departure,

        arrival:
            selectedBus.arrival,

        seats:
            [...selectedSeats],

        passengers:
            [...passengerDetails],

        pricePerPassenger:
            selectedBus.price,

        totalAmount:
            selectedBus.price *
            passengerCount,

        status:
            "Pending Payment"

    };


    /*
       Show payment summary.
    */

    displayPaymentSummary();


    showPage("payment");

}


/* =====================================================
   UPDATE BOOKING SUMMARY
===================================================== */

function updateBookingSummary() {

    const summary =
        document.getElementById(
            "bookingSummary"
        );


    if (!summary || !selectedBus) {
        return;
    }


    let passengerHTML = "";


    passengerDetails.forEach(
        function(passenger, index) {

            passengerHTML += `

                <div class="summary-row">

                    <span>
                        Passenger ${index + 1}
                    </span>

                    <strong>
                        ${selectedSeats[index]}
                    </strong>

                </div>

            `;

        }
    );


    summary.innerHTML = `

        <h4>
            🚌 Booking Summary
        </h4>


        <div class="summary-row">

            <span>
                Bus
            </span>

            <strong>
                ${selectedBus.name}
            </strong>

        </div>


        <div class="summary-row">

            <span>
                Route
            </span>

            <strong>
                ${selectedBus.source}
                →
                ${selectedBus.destination}
            </strong>

        </div>


        <div class="summary-row">

            <span>
                Journey Date
            </span>

            <strong>
                ${formatDate(
                    selectedJourney.date
                )}
            </strong>

        </div>


        <div class="summary-row">

            <span>
                Passengers
            </span>

            <strong>
                ${passengerCount}
            </strong>

        </div>


        <div class="summary-row">

            <span>
                Selected Seats
            </span>

            <strong>
                ${selectedSeats.join(", ")}
            </strong>

        </div>


        <div class="summary-row">

            <span>
                Price per Passenger
            </span>

            <strong>
                ₹${selectedBus.price}
            </strong>

        </div>


        <div class="summary-row">

            <span>
                Total
            </span>

            <strong>
                ₹${selectedBus.price * passengerCount}
            </strong>

        </div>

    `;

}


/* =====================================================
   PAYMENT SUMMARY
===================================================== */

function displayPaymentSummary() {

    const container =
        document.getElementById(
            "paymentSummary"
        );


    if (!container || !currentBooking) {
        return;
    }


    let passengerList = "";


    currentBooking.passengers.forEach(
        function(passenger, index) {

            passengerList += `

                <div class="summary-row">

                    <span>
                        ${index + 1}.
                        ${escapeHtml(
                            passenger.name
                        )}
                    </span>

                    <strong>

                        Seat:
                        ${passenger.seat}

                    </strong>

                </div>

            `;

        }
    );


    container.innerHTML = `

        <h4>
            💳 Payment Summary
        </h4>


        <div class="summary-row">

            <span>
                Bus
            </span>

            <strong>
                ${currentBooking.busName}
            </strong>

        </div>


        <div class="summary-row">

            <span>
                Route
            </span>

            <strong>
                ${currentBooking.source}
                →
                ${currentBooking.destination}
            </strong>

        </div>


        <div class="summary-row">

            <span>
                Journey Date
            </span>

            <strong>
                ${formatDate(
                    currentBooking.date
                )}
            </strong>

        </div>


        ${passengerList}


        <div class="summary-row">

            <span>
                Total Amount
            </span>

            <strong class="text-success">

                ₹${currentBooking.totalAmount}

            </strong>

        </div>

    `;

}


/* =====================================================
   MAKE PAYMENT
===================================================== */

function makePayment() {

    if (!currentBooking) {

        alert("Booking information not found.");

        return;

    }


    const method =
        document.getElementById(
            "paymentMethod"
        ).value;


    if (!method) {

        alert(
            "Please select a payment method."
        );

        return;

    }


    /*
       Demo payment.

       In the final Java project this will be
       connected to the booking/payment backend.
    */

    currentBooking.paymentMethod =
        method;


    currentBooking.status =
        "Confirmed";


    currentBooking.paymentId =
        "PAY" + Date.now();


    /*
       Save booking.
    */

    saveBooking(currentBooking);


    /*
       Mark seats as occupied.
    */

    markSeatsAsOccupied(
        currentBooking
    );


    /*
       Display ticket.
    */

    displayTicket();


    alert(
        "Payment successful! Booking confirmed."
    );


    showPage("ticket");

}


/* =====================================================
   SAVE BOOKING
===================================================== */

function saveBooking(booking) {

    const bookings =
        JSON.parse(
            localStorage.getItem(
                "smartBusBookings"
            ) || "[]"
        );


    bookings.push(booking);


    localStorage.setItem(
        "smartBusBookings",
        JSON.stringify(bookings)
    );

}


/* =====================================================
   MARK SEATS OCCUPIED
===================================================== */

function markSeatsAsOccupied(booking) {

    if (!occupiedSeats[booking.busId]) {

        occupiedSeats[booking.busId] = {};

    }


    booking.passengers.forEach(
        function(passenger) {

            if (
                passenger.gender === "Male" ||
                passenger.gender === "Female"
            ) {

                occupiedSeats[
                    booking.busId
                ][passenger.seat] =
                    passenger.gender;

            } else {

                occupiedSeats[
                    booking.busId
                ][passenger.seat] =
                    "Male";

            }

        }
    );

}


/* =====================================================
   DISPLAY TICKET
===================================================== */

function displayTicket() {

    const container =
        document.getElementById(
            "ticketDetails"
        );


    if (!container || !currentBooking) {
        return;
    }


    let passengersHTML = "";


    currentBooking.passengers.forEach(
        function(passenger, index) {

            passengersHTML += `

                <div class="ticket-row">

                    <span class="ticket-label">

                        Passenger ${index + 1}

                    </span>

                    <span class="ticket-value">

                        ${escapeHtml(
                            passenger.name
                        )}

                        <br>

                        Age:
                        ${passenger.age}

                        |

                        ${passenger.gender}

                        |

                        Seat:
                        ${passenger.seat}

                    </span>

                </div>

            `;

        }
    );


    container.innerHTML = `

        <div class="ticket-card">

            <div class="ticket-header">

                <h3>
                    🚌 Smart Bus Reservation
                </h3>

                <p>
                    🎫 E-Ticket
                </p>

            </div>


            <div class="ticket-row">

                <span class="ticket-label">
                    Booking ID
                </span>

                <span class="ticket-value">

                    ${currentBooking.id}

                </span>

            </div>


            <div class="ticket-row">

                <span class="ticket-label">
                    Bus
                </span>

                <span class="ticket-value">

                    ${currentBooking.busName}

                    <br>

                    ${currentBooking.busNumber}

                </span>

            </div>


            <div class="ticket-row">

                <span class="ticket-label">
                    Route
                </span>

                <span class="ticket-value">

                    ${currentBooking.source}

                    →

                    ${currentBooking.destination}

                </span>

            </div>


            <div class="ticket-row">

                <span class="ticket-label">
                    Journey Date
                </span>

                <span class="ticket-value">

                    ${formatDate(
                        currentBooking.date
                    )}

                </span>

            </div>


            <div class="ticket-row">

                <span class="ticket-label">
                    Departure
                </span>

                <span class="ticket-value">

                    ${currentBooking.departure}

                </span>

            </div>


            <div class="ticket-row">

                <span class="ticket-label">
                    Arrival
                </span>

                <span class="ticket-value">

                    ${currentBooking.arrival}

                </span>

            </div>


            ${passengersHTML}


            <div class="ticket-row">

                <span class="ticket-label">
                    Payment
                </span>

                <span class="ticket-value">

                    ${currentBooking.paymentMethod}

                </span>

            </div>


            <div class="ticket-row">

                <span class="ticket-label">
                    Total Amount
                </span>

                <span class="ticket-value">

                    ₹${currentBooking.totalAmount}

                </span>

            </div>


            <div class="ticket-row">

                <span class="ticket-label">
                    Status
                </span>

                <span class="ticket-value text-success">

                    ✅ Confirmed

                </span>

            </div>

        </div>

    `;

}


/* =====================================================
   PRINT TICKET
===================================================== */

function printTicket() {

    const ticket =
        document.getElementById(
            "ticketDetails"
        );


    if (!ticket) {
        return;
    }


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=800,height=700"
        );


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Smart Bus Ticket
            </title>

            <style>

                body {
                    font-family: Arial;
                    padding: 30px;
                }

                .ticket-card {
                    max-width: 700px;
                    margin: auto;
                    border: 2px dashed #333;
                    padding: 30px;
                }

                .ticket-header {
                    text-align: center;
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }

                .ticket-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #eee;
                }

                .ticket-label {
                    font-weight: bold;
                }

                .ticket-value {
                    text-align: right;
                }

            </style>

        </head>

        <body>

            ${ticket.innerHTML}

        </body>

        </html>

    `);


    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.close();

}


/* =====================================================
   MY BOOKINGS
===================================================== */

function displayMyBookings() {

    const container =
        document.getElementById(
            "bookingList"
        );


    if (!container) {
        return;
    }


    const bookings =
        JSON.parse(
            localStorage.getItem(
                "smartBusBookings"
            ) || "[]"
        );


    let userBookings = bookings;


    if (
        currentUser &&
        currentUser.email
    ) {

        userBookings =
            bookings.filter(
                booking =>
                    booking.userEmail ===
                    currentUser.email
            );

    }


    if (userBookings.length === 0) {

        container.innerHTML = `

            <div class="col-12">

                <div class="empty-state">

                    <div class="empty-state-icon">
                        🎫
                    </div>

                    <h4>
                        No bookings found
                    </h4>

                    <p>
                        Your confirmed bus bookings
                        will appear here.
                    </p>

                    <button
                        class="btn btn-primary"
                        onclick="showPage('searchBus')">

                        Search Bus

                    </button>

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    userBookings
        .slice()
        .reverse()
        .forEach(
            function(booking) {

                let passengers =
                    booking.passengers
                        .map(
                            passenger =>
                                `
                                <li>
                                    ${escapeHtml(
                                        passenger.name
                                    )}
                                    -
                                    Seat ${passenger.seat}
                                    -
                                    ${passenger.gender}
                                </li>
                                `
                        )
                        .join("");


                container.innerHTML += `

                    <div class="col-md-6">

                        <div class="booking-card">

                            <h4>
                                🚌
                                ${booking.busName}
                            </h4>


                            <p>

                                <strong>
                                    ${booking.source}
                                    →
                                    ${booking.destination}
                                </strong>

                            </p>


                            <p>

                                📅
                                ${formatDate(
                                    booking.date
                                )}

                            </p>


                            <p>

                                💺 Seats:
                                ${booking.seats.join(", ")}

                            </p>


                            <p>

                                👥
                                ${booking.passengers.length}
                                Passenger(s)

                            </p>


                            <ul>

                                ${passengers}

                            </ul>


                            <p>

                                💰
                                ₹${booking.totalAmount}

                            </p>


                            <span class="booking-status status-confirmed">

                                ${booking.status}

                            </span>


                            <div class="mt-3">

                                <button
                                    class="btn btn-primary btn-sm me-2"
                                    onclick="viewBookingTicket('${booking.id}')">

                                    View Ticket

                                </button>


                                <button
                                    class="btn btn-outline-danger btn-sm"
                                    onclick="cancelBooking('${booking.id}')">

                                    Cancel

                                </button>

                            </div>

                        </div>

                    </div>

                `;

            }
        );

}


/* =====================================================
   VIEW BOOKING TICKET
===================================================== */

function viewBookingTicket(bookingId) {

    const bookings =
        JSON.parse(
            localStorage.getItem(
                "smartBusBookings"
            ) || "[]"
        );


    const booking =
        bookings.find(
            item =>
                item.id === bookingId
        );


    if (!booking) {

        alert("Booking not found.");

        return;

    }


    currentBooking = booking;


    displayTicket();

    showPage("ticket");

}


/* =====================================================
   CANCEL BOOKING
===================================================== */

function cancelBooking(bookingId) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmCancel) {
        return;
    }


    let bookings =
        JSON.parse(
            localStorage.getItem(
                "smartBusBookings"
            ) || "[]"
        );


    const booking =
        bookings.find(
            item =>
                item.id === bookingId
        );


    if (!booking) {

        alert("Booking not found.");

        return;

    }


    booking.status =
        "Cancelled";


    /*
       Release the seats.
    */

    if (occupiedSeats[booking.busId]) {

        booking.passengers.forEach(
            function(passenger) {

                delete occupiedSeats[
                    booking.busId
                ][passenger.seat];

            }
        );

    }


    localStorage.setItem(
        "smartBusBookings",
        JSON.stringify(bookings)
    );


    alert("Booking cancelled successfully.");


    displayMyBookings();

}


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

function loadAdminDashboard() {

    const totalBuses =
        document.getElementById(
            "adminTotalBuses"
        );


    const totalUsers =
        document.getElementById(
            "adminTotalUsers"
        );


    const totalBookings =
        document.getElementById(
            "adminTotalBookings"
        );


    const users =
        JSON.parse(
            localStorage.getItem(
                "smartBusUsers"
            ) || "[]"
        );


    const bookings =
        JSON.parse(
            localStorage.getItem(
                "smartBusBookings"
            ) || "[]"
        );


    if (totalBuses) {

        totalBuses.textContent =
            buses.length;

    }


    if (totalUsers) {

        totalUsers.textContent =
            users.length;

    }


    if (totalBookings) {

        totalBookings.textContent =
            bookings.length;

    }

}


/* =====================================================
   ADMIN - MANAGE BUSES
===================================================== */

function showAdminBuses() {

    const container =
        document.getElementById(
            "adminContent"
        );


    if (!container) {
        return;
    }


    let html = `

        <div class="admin-table">

            <h4>
                🚌 Manage Buses
            </h4>

            <div class="table-responsive">

                <table class="table table-bordered">

                    <thead>

                        <tr>

                            <th>
                                Bus
                            </th>

                            <th>
                                Number
                            </th>

                            <th>
                                Route
                            </th>

                            <th>
                                Time
                            </th>

                            <th>
                                Price
                            </th>

                        </tr>

                    </thead>

                    <tbody>

    `;


    buses.forEach(
        function(bus) {

            html += `

                <tr>

                    <td>
                        ${bus.name}
                    </td>

                    <td>
                        ${bus.number}
                    </td>

                    <td>
                        ${bus.source}
                        →
                        ${bus.destination}
                    </td>

                    <td>
                        ${bus.departure}
                    </td>

                    <td>
                        ₹${bus.price}
                    </td>

                </tr>

            `;

        }
    );


    html += `

                    </tbody>

                </table>

            </div>

        </div>

    `;


    container.innerHTML = html;

}


/* =====================================================
   ADMIN - USERS
===================================================== */

function showAdminUsers() {

    const container =
        document.getElementById(
            "adminContent"
        );


    const users =
        JSON.parse(
            localStorage.getItem(
                "smartBusUsers"
            ) || "[]"
        );


    if (!container) {
        return;
    }


    if (users.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    👥
                </div>

                <h4>
                    No users registered
                </h4>

            </div>

        `;

        return;

    }


    let html = `

        <div class="admin-table">

            <h4>
                👥 Registered Users
            </h4>

            <div class="table-responsive">

                <table class="table table-bordered">

                    <thead>

                        <tr>

                            <th>
                                Name
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Phone
                            </th>

                            <th>
                                City
                            </th>

                        </tr>

                    </thead>

                    <tbody>

    `;


    users.forEach(
        function(user) {

            html += `

                <tr>

                    <td>
                        ${escapeHtml(
                            user.name
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            user.email
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            user.phone
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            user.city
                        )}
                    </td>

                </tr>

            `;

        }
    );


    html += `

                    </tbody>

                </table>

            </div>

        </div>

    `;


    container.innerHTML = html;

}


/* =====================================================
   ADMIN - BOOKINGS
===================================================== */

function showAdminBookings() {

    const container =
        document.getElementById(
            "adminContent"
        );


    const bookings =
        JSON.parse(
            localStorage.getItem(
                "smartBusBookings"
            ) || "[]"
        );


    if (!container) {
        return;
    }


    if (bookings.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    🎫
                </div>

                <h4>
                    No bookings available
                </h4>

            </div>

        `;

        return;

    }


    let html = `

        <div class="admin-table">

            <h4>
                🎫 All Bookings
            </h4>

            <div class="table-responsive">

                <table class="table table-bordered">

                    <thead>

                        <tr>

                            <th>
                                Booking ID
                            </th>

                            <th>
                                Route
                            </th>

                            <th>
                                Passengers
                            </th>

                            <th>
                                Seats
                            </th>

                            <th>
                                Amount
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

    `;


    bookings.forEach(
        function(booking) {

            html += `

                <tr>

                    <td>
                        ${booking.id}
                    </td>

                    <td>
                        ${booking.source}
                        →
                        ${booking.destination}
                    </td>

                    <td>
                        ${booking.passengers.length}
                    </td>

                    <td>
                        ${booking.seats.join(", ")}
                    </td>

                    <td>
                        ₹${booking.totalAmount}
                    </td>

                    <td>
                        ${booking.status}
                    </td>

                </tr>

            `;

        }
    );


    html += `

                    </tbody>

                </table>

            </div>

        </div>

    `;


    container.innerHTML = html;

}


/* =====================================================
   AVAILABLE SEAT COUNT
===================================================== */

function getAvailableSeatCount(
    busId,
    totalSeats
) {

    const occupied =
        occupiedSeats[busId]
            ? Object.keys(
                occupiedSeats[busId]
            ).length
            : 0;


    return totalSeats - occupied;

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    if (isNaN(date.getTime())) {

        return dateString;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(value) {

    if (value === null || value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   RESET BOOKING
===================================================== */

function resetBookingData() {

    selectedBus = null;

    selectedSeats = [];

    passengerCount = 0;

    passengerDetails = [];

    currentBooking = null;

}


/* =====================================================
   CONSOLE MESSAGE
===================================================== */

console.log(
    "Smart Bus Reservation System loaded successfully."
);

console.log(
    "Demo admin login: admin@gmail.com / admin123"
);