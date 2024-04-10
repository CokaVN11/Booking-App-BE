# Booking-App-BE

## Render link: https://booking-app-be.onrender.com

## Setup environment
1. Clone the repository
2. Run `npm install`
3. Create a `.env` file in the root directory and add the following environment variables:
```bash
PORT=3000
MONGO_URL=your_mongo_uri
```
4. Run `npm run start` to start the server


## Database schema
### Account schema
- username: User's username (min length: 6)
- email: User's email address (min length: 6)
- password: User's password (min length: 6)
- role: User's role (customer or hotelier)
- bank_number: User's bank account number (optional)
- wallet: User's wallet balance (default: 0)
- phone: User's phone number (optional)
- fullname: User's full name (for customers)
- hotel_name: Hotel name (for hoteliers)
- hotel_address: Hotel address (for hoteliers)
- description: Description of the hotel (for hoteliers)
- image: URL of the hotel image (for hoteliers)

### Room Type schema
- name: Room type name
- hotel: Hotel ID (reference to the _id field of the Account schema, each hotel can have different room types)
- description: Room type description
- price: Room price
- guest: Number of guests
- bedroom: Number of bedrooms
- bathroom: Number of bathrooms
- area: Room area

### Room schema
- hotel: Hotel ID (reference to the _id field of the Account schema)
- room_type: Room type ID (reference to the _id field of the Room Type schema)
- name: Room name
- is_accepted: Room status (true: accepted, false: pending)
- is_booked: Room status (true: booked, false: available)
- image: URLs of the room image
- amenities_ids: Array of amenity IDs (reference to the _id field of the Amenity schema)

### Amenity schema
- name: Amenity name

### Booking schema
- hotel: Hotel ID (reference to the _id field of the Account schema)
- room: Room ID (reference to the _id field of the Room schema)
- customer: Customer ID (reference to the _id field of the Account schema)
- check_in: Check-in date
- check_out: Check-out date
- is_cancelled: Booking status (true: cancelled, false: booked)
- status: Booking status (waiting, approved, rejected, canceled, completed, staying)

### Bill Schema
- customer: Customer ID (reference to the _id field of the Account schema)
- total: Total amount
- status: Bill status (waiting, paid, canceled)
- bookings: Array of booking IDs (reference to the _id field of the Booking schema)

### Notification Schema
- from_id: Sender ID (reference to the _id field of the Account schema)
- to_id: Receiver ID (reference to the _id field of the Account schema)
- for: Recipient role (customer or hotelier)
- title: Notification title
- content: Notification content
- status: Notification status ('accepted', 'cancelled', 'waiting', 'warning', 'approved', 'rejected'; default: 'waiting')
- booking: Booking ID (reference to the _id field of the Booking schema)
- room: Room ID (reference to the _id field of the Room schema)
- is_read: Notification status (true: read, false: unread)

### Report Schema
- booking: Booking ID (reference to the _id field of the Booking schema)
- hotel: Hotel ID (reference to the _id field of the Account schema)
- title: Report title
- content: Report content
- is_read: Report status (true: read, false: unread)

### Rating Schema
- hotel: Hotel ID (reference to the _id field of the Account schema)
- customer: Customer ID (reference to the _id field of the Account schema)
- room: Room ID (reference to the _id field of the Room schema)
- content: Rating content
- star: Rating star (0-5, 0: not rated)
