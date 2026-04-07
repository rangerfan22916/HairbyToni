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
const time = document.getElementById("time").value;
const message = document.getElementById("message").value.trim();

// Basic validation
if(name === "" || email === "" || phone === "" || service === "" || date === "" || time === ""){
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
alert(`Thank you ${name}! Your appointment request for ${service} on ${date} at ${time} has been submitted. We'll contact you at ${phone} or ${email} to confirm your booking.`);

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
const dateKey = date.getFullYear() + '-' + 
                String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                String(date.getDate()).padStart(2, '0');
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
// Create specific time slots instead of 30-minute intervals
const specificTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

specificTimes.forEach(time => {
const timeParts = time.split(':');
const hours = timeParts[0];
const minutes = timeParts[1];
const hourNum = parseInt(hours);
if (hourNum >= startHour && hourNum < endHour) {
slots.push({
time: time,
available: true,
booked: false
});
}
});

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

// Clear time slots when changing months
document.getElementById('timeSlotsModal').style.display = 'none';

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
const dateKey = currentDay.getFullYear() + '-' + 
                String(currentDay.getMonth() + 1).padStart(2, '0') + '-' + 
                String(currentDay.getDate()).padStart(2, '0');
const dayData = this.availabilityData[dateKey];

// For testing: make all days in the future available
const today = new Date();
today.setHours(0, 0, 0, 0);
const isFuture = currentDay >= today;

if ((dayData && dayData.available) || isFuture) {
dayElement.classList.add('available');
} else {
dayElement.classList.add('unavailable');
}

// Check if it's today
if (currentDay.toDateString() === today.toDateString()) {
dayElement.classList.add('today');
}
}

// Add click handler
dayElement.addEventListener('click', () => {
const clickDateKey = currentDay.getFullYear() + '-' + 
                    String(currentDay.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(currentDay.getDate()).padStart(2, '0');
this.selectDate(currentDay, clickDateKey);
});

calendarGrid.appendChild(dayElement);
}
}

selectDate(date, dateKey) {
this.selectedDate = date;
const dayData = this.availabilityData[dateKey];

// Clear previous selection
document.querySelectorAll('.calendar-day.selected').forEach(day => {
day.classList.remove('selected');
});

const modal = document.getElementById('timeSlotsModal');
const selectedDateSpan = document.getElementById('selectedDate');
const timeGrid = document.getElementById('timeGrid');

// Clear existing time slots
timeGrid.innerHTML = '';

if (dayData && dayData.available) {
// Highlight selected date
const dayElements = document.querySelectorAll('.calendar-day');
dayElements.forEach(dayEl => {
const dayNumber = parseInt(dayEl.textContent);
if (dayNumber === date.getDate() && !dayEl.classList.contains('other-month')) {
dayEl.classList.add('selected');
}
});

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

modal.style.display = 'flex';
} else {
// Check if it's a future date that should be available
const today = new Date();
today.setHours(0, 0, 0, 0);
if (date >= today) {
// Create default slots for future dates
const dayOfWeek = date.getDay();
let slots = [];
if (dayOfWeek === 0) { // Sunday - closed
alert('Sorry, we are closed on this date. Please select another date.');
return;
} else if (dayOfWeek === 6) { // Saturday
slots = this.generateTimeSlots(8, 17);
} else { // Monday-Friday
slots = this.generateTimeSlots(9, 19);
}

// Highlight selected date
const dayElements = document.querySelectorAll('.calendar-day');
dayElements.forEach(dayEl => {
const dayNumber = parseInt(dayEl.textContent);
if (dayNumber === date.getDate() && !dayEl.classList.contains('other-month')) {
dayEl.classList.add('selected');
}
});

selectedDateSpan.textContent = date.toLocaleDateString('en-US', {
weekday: 'long',
year: 'numeric',
month: 'long',
day: 'numeric'
});

slots.forEach(slot => {
const slotElement = document.createElement('div');
slotElement.className = 'time-slot';
slotElement.textContent = this.formatTime(slot.time);

slotElement.classList.add('available');
slotElement.addEventListener('click', () => this.selectTimeSlot(slot, dateKey));

timeGrid.appendChild(slotElement);
});

modal.style.display = 'flex';
} else {
alert('Sorry, we are closed on this date. Please select another date.');
}
}
}

selectTimeSlot(slot, dateKey) {
// Show custom confirmation modal instead of browser confirm
this.showConfirmationModal(slot, dateKey);
}

showConfirmationModal(slot, dateKey) {
const modal = document.getElementById('confirmModal');
const confirmDate = document.getElementById('confirmDate');
const confirmTime = document.getElementById('confirmTime');

// Populate modal with appointment details
confirmDate.textContent = this.selectedDate.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});
confirmTime.textContent = this.formatTime(slot.time);

// Show modal
modal.style.display = 'flex';

// Handle confirm button
const confirmBtn = document.getElementById('confirmBook');
const cancelBtn = document.getElementById('confirmCancel');

// Remove existing event listeners
const newConfirmBtn = confirmBtn.cloneNode(true);
const newCancelBtn = cancelBtn.cloneNode(true);
confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

// Add new event listeners
newConfirmBtn.addEventListener('click', () => {
  this.confirmBooking(slot, dateKey);
});

newCancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});
}

confirmBooking(slot, dateKey) {
// Mark slot as booked
let dayData = this.availabilityData[dateKey];
if (!dayData) {
// Create data structure for this date if it doesn't exist
const selectedDate = new Date(dateKey + 'T00:00:00');
const dayOfWeek = selectedDate.getDay();
dayData = {
available: dayOfWeek !== 0, // Not Sunday
slots: dayOfWeek === 0 ? [] : (dayOfWeek === 6 ? this.generateTimeSlots(8, 17) : this.generateTimeSlots(9, 19))
};
this.availabilityData[dateKey] = dayData;
}

const slotIndex = dayData.slots.findIndex(s => s.time === slot.time);
if (slotIndex !== -1) {
dayData.slots[slotIndex].booked = true;
this.saveAvailabilityData();
this.renderCalendar();
this.selectDate(this.selectedDate, dateKey);
}

// Close confirmation modal
document.getElementById('confirmModal').style.display = 'none';

// Auto-fill the booking form
this.populateBookingForm(slot);

// Close time slots modal
document.getElementById('timeSlotsModal').style.display = 'none';

// Scroll to the booking form and highlight it
const bookingForm = document.getElementById('contactForm');
if (bookingForm) {
bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
setTimeout(() => {
bookingForm.style.boxShadow = '0 0 20px rgba(196, 122, 139, 0.6)';
setTimeout(() => {
bookingForm.style.boxShadow = '';
}, 2000);
}, 500);
}
}

formatTime(timeString) {
const timeParts = timeString.split(':');
const hours = timeParts[0];
const minutes = timeParts[1];
const hour = parseInt(hours);
const ampm = hour >= 12 ? 'PM' : 'AM';
const displayHour = hour % 12 || 12;
return `${displayHour}:${minutes} ${ampm}`;
}

populateBookingForm(slot) {
// Fill in the date field
const dateInput = document.getElementById('date');
if (dateInput) {
const dateString = this.selectedDate.getFullYear() + '-' + 
                  String(this.selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(this.selectedDate.getDate()).padStart(2, '0');
dateInput.value = dateString;
}

// Fill in the time field
const timeInput = document.getElementById('time');
if (timeInput) {
timeInput.value = slot.time;
}
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
const selectedDate = new Date(year, month, dayNumber);
const dateKey = selectedDate.getFullYear() + '-' + 
                String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + 
                String(selectedDate.getDate()).padStart(2, '0');

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

// Modal functionality
const modal = document.getElementById('timeSlotsModal');
const modalClose = document.getElementById('modalClose');

if (modalClose) {
modalClose.addEventListener('click', () => {
modal.style.display = 'none';
});
}

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
if (e.target === modal) {
modal.style.display = 'none';
}
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && modal.style.display === 'flex') {
modal.style.display = 'none';
}
});

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');
if (backToTopButton) {
window.addEventListener('scroll', function() {
if (window.pageYOffset > 300) {
backToTopButton.style.display = 'block';
} else {
backToTopButton.style.display = 'none';
}
});

backToTopButton.addEventListener('click', function() {
window.scrollTo({
top: 0,
behavior: 'smooth'
});
});
}

});