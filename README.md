# Hair by Toni - Salon Website

A professional single-page website for Hair by Toni salon with booking system and calendar management.

## Features

- **Services**: Blowouts, Haircuts, and Glazes
- **Interactive Calendar**: Check availability and book appointments
- **Admin Panel**: Spreadsheet-like interface to manage availability
- **Responsive Design**: Works on all devices
- **Professional Styling**: Modern, clean design

## Services Offered

1. **Blowouts** - Professional blowouts for smooth, voluminous hair
2. **Haircuts** - Custom cuts designed to match your style
3. **Glazes** - Color-enhancing glazes for shine and protection

## How to Use the Calendar

### For Customers:
1. Visit the website
2. Scroll to the "Check Availability" section
3. Click on a date to see available time slots
4. Select a time slot and fill out the booking form

### For Toni (Admin):

#### Method 1: Quick Admin Mode
1. Add `?admin=true` to the URL: `index.html?admin=true`
2. Click the red "Admin Mode" button in the bottom right
3. Right-click on calendar days to toggle availability

#### Method 2: Full Admin Panel
1. Visit `admin.html` in your browser
2. Use the spreadsheet interface to manage availability
3. Select month/year to edit
4. Click cells to toggle availability or block time slots
5. Use bulk actions for quick changes

## Admin Panel Features

- **Spreadsheet View**: See all dates and time slots in a table
- **Bulk Actions**:
  - Set all days available/unavailable
  - Set weekdays available, weekends closed
  - Clear all bookings
- **Individual Control**: Click any cell to toggle availability
- **Auto-Save**: Changes are automatically saved to browser storage

## Business Hours

- Monday - Friday: 9:00 AM - 7:00 PM
- Saturday: 8:00 AM - 5:00 PM
- Sunday: Closed

## Technical Details

- Built with HTML5, CSS3, and JavaScript
- No backend required - uses localStorage for data persistence
- Fully responsive design
- Modern CSS Grid and Flexbox layouts

## Getting Started

1. Open `index.html` in a web browser
2. For admin access, visit `index.html?admin=true` or `admin.html`
3. All data is stored locally in your browser

## File Structure

```
HairbyToni/
├── index.html          # Main website
├── admin.html          # Admin panel
├── style.css           # Stylesheets
├── script.js           # JavaScript functionality
└── favicon.svg         # Site icon
```