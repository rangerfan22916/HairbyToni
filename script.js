// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navContainer = document.querySelector('.nav-container');

if (hamburger && navContainer) {
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navContainer.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!navContainer.contains(event.target) && !hamburger.contains(event.target)) {
      hamburger.classList.remove('active');
      navContainer.classList.remove('active');
    }
  });

  // Close menu when clicking a link
  const navLinks = navContainer.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navContainer.classList.remove('active');
    });
  });
}

const form = document.getElementById("contactForm");

if(form){
form.addEventListener("submit", function(e){
e.preventDefault(); // Prevent default form submission

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim();
const phone = document.getElementById("phone").value.trim();
const service = document.getElementById("service").value;
const date = document.getElementById("date").value;
const message = document.getElementById("message").value.trim();

// Basic validation
if(name === "" || email === "" || phone === "" || service === "" || date === ""){
alert("Please fill out all required fields.");
return;
}

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(!emailRegex.test(email)){
alert("Please enter a valid email address.");
return;
}

// Phone validation (basic)
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
if(!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))){
alert("Please enter a valid phone number.");
return;
}

// Date validation (ensure it's not in the past)
const selectedDate = new Date(date);
const today = new Date();
today.setHours(0, 0, 0, 0);

if(selectedDate < today){
alert("Please select a future date for your appointment.");
return;
}

// If all validations pass, show success message
alert(`Thank you ${name}! Your appointment request for ${service} on ${date} has been submitted. We'll contact you at ${phone} or ${email} to confirm your booking.`);

// Reset form
form.reset();
});
}

// Calendar Functionality
class CalendarManager {
constructor() {
this.currentDate = new Date();
this.selectedDate = null;
this.availabilityData = this.loadAvailabilityData();
this.init();
}

init() {
this.renderCalendar();
this.bindEvents();
}

loadAvailabilityData() {
// Load availability from Google Sheets
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with your Google Sheet ID
const API_KEY = 'YOUR_GOOGLE_API_KEY_HERE'; // Replace with your Google API Key

// Try to load from Google Sheets first
if (SHEET_ID !== 'YOUR_GOOGLE_SHEET_ID_HERE' && API_KEY !== 'YOUR_GOOGLE_API_KEY_HERE') {
  this.loadFromGoogleSheets(SHEET_ID, API_KEY);
}

// Load availability from localStorage as fallback
const saved = localStorage.getItem('hairbytoni-availability');
if (saved) {
return JSON.parse(saved);
}

// Default availability: Monday-Friday 9AM-7PM, Saturday 8AM-5PM, Sunday closed
const defaultData = {};
const today = new Date();

for (let i = 0; i < 90; i++) { // Next 90 days
const date = new Date(today);
date.setDate(today.getDate() + i);
const dateKey = date.toISOString().split('T')[0];
const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.

if (dayOfWeek === 0) { // Sunday - closed
defaultData[dateKey] = { available: false, slots: [] };
} else if (dayOfWeek === 6) { // Saturday - 8AM-5PM
defaultData[dateKey] = {
available: true,
slots: this.generateTimeSlots(8, 17) // 8 AM to 5 PM
};
} else { // Monday-Friday - 9AM-7PM
defaultData[dateKey] = {
available: true,
slots: this.generateTimeSlots(9, 19) // 9 AM to 7 PM
};
}
}

return defaultData;
}

generateTimeSlots(startHour, endHour) {
const slots = [];
for (let hour = startHour; hour < endHour; hour++) {
for (let minute of [0, 30]) { // 30-minute intervals
const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
slots.push({
time: timeString,
available: true,
booked: false
});
}
}
return slots;
}

saveAvailabilityData() {
localStorage.setItem('hairbytoni-availability', JSON.stringify(this.availabilityData));
}

renderCalendar() {
const year = this.currentDate.getFullYear();
const month = this.currentDate.getMonth();

// Update month header
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
'July', 'August', 'September', 'October', 'November', 'December'];
document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

// Clear existing calendar
const calendarGrid = document.querySelector('.calendar-grid');
const existingDays = calendarGrid.querySelectorAll('.calendar-day');
existingDays.forEach(day => day.remove());

// Get first day of month and last day
const firstDay = new Date(year, month, 1);
const lastDay = new Date(year, month + 1, 0);
const startDate = new Date(firstDay);
startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

// Generate calendar days
for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
const currentDay = new Date(startDate);
currentDay.setDate(startDate.getDate() + i);

const dayElement = document.createElement('div');
dayElement.className = 'calendar-day';
dayElement.textContent = currentDay.getDate();

// Check if day is in current month
if (currentDay.getMonth() !== month) {
dayElement.classList.add('other-month');
} else {
// Check availability
const dateKey = currentDay.toISOString().split('T')[0];
const dayData = this.availabilityData[dateKey];

if (dayData && dayData.available) {
dayElement.classList.add('available');
} else {
dayElement.classList.add('unavailable');
}

// Check if it's today
const today = new Date();
if (currentDay.toDateString() === today.toDateString()) {
dayElement.classList.add('today');
}
}

// Add click handler
dayElement.addEventListener('click', () => this.selectDate(currentDay, dateKey));

calendarGrid.appendChild(dayElement);
}
}

selectDate(date, dateKey) {
this.selectedDate = date;
const dayData = this.availabilityData[dateKey];

const timeSlotsDiv = document.getElementById('timeSlots');
const selectedDateSpan = document.getElementById('selectedDate');
const timeGrid = document.getElementById('timeGrid');

// Clear existing time slots
timeGrid.innerHTML = '';

if (dayData && dayData.available) {
selectedDateSpan.textContent = date.toLocaleDateString('en-US', {
weekday: 'long',
year: 'numeric',
month: 'long',
day: 'numeric'
});

dayData.slots.forEach(slot => {
const slotElement = document.createElement('div');
slotElement.className = 'time-slot';
slotElement.textContent = this.formatTime(slot.time);

if (slot.booked) {
slotElement.classList.add('booked');
slotElement.textContent += ' (Booked)';
} else {
slotElement.classList.add('available');
slotElement.addEventListener('click', () => this.selectTimeSlot(slot, dateKey));
}

timeGrid.appendChild(slotElement);
});

timeSlotsDiv.style.display = 'block';
} else {
timeSlotsDiv.style.display = 'none';
alert('Sorry, we are closed on this date. Please select another date.');
}
}

selectTimeSlot(slot, dateKey) {
if (confirm(`Book appointment for ${this.selectedDate.toLocaleDateString()} at ${this.formatTime(slot.time)}?`)) {
// Mark slot as booked
const dayData = this.availabilityData[dateKey];
const slotIndex = dayData.slots.findIndex(s => s.time === slot.time);
if (slotIndex !== -1) {
dayData.slots[slotIndex].booked = true;
this.saveAvailabilityData();
this.renderCalendar();
this.selectDate(this.selectedDate, dateKey);
}

// Here you could integrate with the booking form
alert('Time slot selected! Please fill out the booking form above to complete your appointment.');
}
}

formatTime(timeString) {
const [hours, minutes] = timeString.split(':');
const hour = parseInt(hours);
const ampm = hour >= 12 ? 'PM' : 'AM';
const displayHour = hour % 12 || 12;
return `${displayHour}:${minutes} ${ampm}`;
}

bindEvents() {
document.getElementById('prevMonth').addEventListener('click', () => {
this.currentDate.setMonth(this.currentDate.getMonth() - 1);
this.renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
this.currentDate.setMonth(this.currentDate.getMonth() + 1);
this.renderCalendar();
});
}
}

// Admin Interface for Editing Availability
class AdminManager {
constructor(calendarManager) {
this.calendarManager = calendarManager;
this.init();
}

init() {
// Add admin button (only visible if admin mode is enabled)
this.addAdminButton();
}

addAdminButton() {
const adminButton = document.createElement('button');
adminButton.textContent = 'Admin Mode';
adminButton.style.cssText = `
position: fixed;
bottom: 20px;
right: 20px;
background: #dc3545;
color: white;
border: none;
padding: 10px 20px;
border-radius: 6px;
cursor: pointer;
z-index: 1000;
display: none;
`;

adminButton.addEventListener('click', () => this.toggleAdminMode());
document.body.appendChild(adminButton);

// Show admin button if URL contains ?admin=true
if (window.location.search.includes('admin=true')) {
adminButton.style.display = 'block';
}
}

toggleAdminMode() {
const calendarDays = document.querySelectorAll('.calendar-day:not(.other-month)');
const isAdminMode = document.body.classList.contains('admin-mode');

if (!isAdminMode) {
document.body.classList.add('admin-mode');
alert('Admin Mode: Click on calendar days to toggle availability');

calendarDays.forEach(day => {
day.addEventListener('contextmenu', (e) => {
e.preventDefault();
this.toggleDayAvailability(day);
});
});
} else {
document.body.classList.remove('admin-mode');
alert('Admin Mode disabled');
}
}

toggleDayAvailability(dayElement) {
const dayNumber = parseInt(dayElement.textContent);
const year = this.calendarManager.currentDate.getFullYear();
const month = this.calendarManager.currentDate.getMonth();
const date = new Date(year, month, dayNumber);
const dateKey = date.toISOString().split('T')[0];

const dayData = this.calendarManager.availabilityData[dateKey];
if (dayData) {
dayData.available = !dayData.available;
this.calendarManager.saveAvailabilityData();
this.calendarManager.renderCalendar();
}
}
}

// Google Sheets Integration
async function loadFromGoogleSheets(sheetId, apiKey) {
try {
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;
const response = await fetch(url);
const data = await response.json();

if (data.values) {
  const availabilityData = {};
  const rows = data.values.slice(1); // Skip header row

  rows.forEach(row => {
    const dateStr = row[0];
    const dayName = row[1];
    const available = row[2]?.toUpperCase() === 'TRUE';
    const slots = [];

    // Process time slots (starting from column D)
    for (let i = 3; i < row.length; i++) {
      const timeHeader = data.values[0][i]; // Get time from header row
      const status = row[i];
      
      if (timeHeader && status) {
        slots.push({
          time: timeHeader.trim(),
          available: status.trim().toUpperCase() === 'OPEN',
          booked: status.trim().toUpperCase() === 'BOOKED'
        });
      }
    }

    if (dateStr && dayName) {
      availabilityData[dateStr.trim()] = {
        available: available,
        slots: slots
      };
    }
  });

  // Save to localStorage so it updates the calendar
  localStorage.setItem('hairbytoni-availability', JSON.stringify(availabilityData));
  
  // Refresh calendar if it exists
  if (window.calendarManager) {
    window.calendarManager.availabilityData = availabilityData;
    window.calendarManager.renderCalendar();
  }
}
} catch (error) {
console.log('Could not load from Google Sheets. Using local data.', error);
}
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
const calendarManager = new CalendarManager();
window.calendarManager = calendarManager; // Make global so Google Sheets can update it
const adminManager = new AdminManager(calendarManager);

// Show admin link if in admin mode
if (window.location.search.includes('admin=true')) {
const navList = document.querySelector('nav ul');
const adminLi = document.createElement('li');
adminLi.innerHTML = '<a href="admin.html">Admin Panel</a>';
navList.appendChild(adminLi);
}

});