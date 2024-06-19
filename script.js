document.addEventListener("DOMContentLoaded", function() {
    const userForm = document.getElementById('userForm');
    const bookingContainer = document.getElementById('bookingContainer');
    const registerLogin = document.getElementById('registerLogin');
    const formTitle = document.getElementById('formTitle');
    const toggleFormText = document.getElementById('toggleForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const qrCodeLink = document.getElementById('qrCodeLink');

    function registerOrLogin() {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (formTitle.textContent === "Register") {
            if (localStorage.getItem(username)) {
                alert("Username already exists!");
            } else {
                localStorage.setItem(username, password);
                alert("Registration successful!");
                toggleForm();
            }
        } else {
            const storedPassword = localStorage.getItem(username);
            if (storedPassword === password) {
                alert("Login successful!");
                localStorage.setItem('currentUser', username);
                registerLogin.style.display = "none";
                bookingContainer.style.display = "block";
                loadBookingHistory();
            } else {
                alert("Incorrect username or password!");
            }
        }
    }

    function toggleForm() {
        if (formTitle.textContent === "Register") {
            formTitle.textContent = "Login";
            toggleFormText.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleForm()">Register here</a>';
        } else {
            formTitle.textContent = "Register";
            toggleFormText.innerHTML = 'Already have an account? <a href="#" onclick="toggleForm()">Login here</a>';
        }
    }

    function generateQRCode() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const slot = document.getElementById('slot').value;
        const currentUser = localStorage.getItem('currentUser');

        if (name && email && date && time && slot) {
            const qrData = `Name: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}\nSlot: ${slot}`;
            const qr = new QRious({
                element: document.getElementById('qrcode'),
                value: qrData,
                size: 200
            });

            qrCodeLink.href = qr.toDataURL();
            qrCodeLink.style.display = 'block';

            addBooking(name, email, date, time, slot);
            saveBooking(currentUser, name, email, date, time, slot);

            alert('Booking successful! QR code generated.');
        } else {
            alert('Please fill in all fields.');
        }
    }

    function addBooking(name, email, date, time, slot) {
        const bookingsDiv = document.getElementById('bookings');
        const bookingInfo = document.createElement('div');
        bookingInfo.classList.add('booking-info');
        bookingInfo.innerHTML = `
            <h3>Booking Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Slot:</strong> ${slot}</p>
            <hr>
        `;
        bookingsDiv.appendChild(bookingInfo);
    }

    function saveBooking(username, name, email, date, time, slot) {
        const booking = { name, email, date, time, slot };
        let bookingHistory = JSON.parse(localStorage.getItem(`${username}_bookings`)) || [];
        bookingHistory.push(booking);
        localStorage.setItem(`${username}_bookings`, JSON.stringify(bookingHistory));
    }

    function loadBookingHistory() {
        const currentUser = localStorage.getItem('currentUser');
        const bookingHistory = JSON.parse(localStorage.getItem(`${currentUser}_bookings`)) || [];
        const bookingsDiv = document.getElementById('bookings');
        bookingsDiv.innerHTML = '';
        bookingHistory.forEach(booking => {
            addBooking(booking.name, booking.email, booking.date, booking.time, booking.slot);
        });
    }

    window.registerOrLogin = registerOrLogin;
    window.toggleForm = toggleForm;
    window.generateQRCode = generateQRCode;
});

