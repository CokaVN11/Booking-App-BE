type Account = {
  username: string;
  email: string;
  password: string;
  role: string;
  bank_number: string;
  wallet: number;
  phone: string;
  fullname: string;
  hotel_name: string | null;
  hotel_address: string | null;
  description: string | null;
  image: string | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// type Amenity

type Bill = {
  customer: string;
  total: number;
  status: string;
  bookings: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

type Booking = {
  hotel: string;
  room: string;
  customer: string;
  check_in: Date;
  check_out: Date;
  is_canceled: boolean;
  status: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

type Noti = {
  from_id: string;
  to_id: string;
  for: string;
  title: string;
  content: string;
  status?: string;
  booking: string;
  room: string;
  is_read?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

type Rating = {
  customer: string;
  hotel: string;
  room: string;
  content: string;
  star: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

type Report = {
  booking: string;
  hotel: string;
  title: string;
  content: string;
  is_read: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

type Room = {
  hotel: string;
  room_type: string;
  name: string;
  is_accepted: boolean;
  is_booked: boolean;
  image: string[];
  amenities_ids: string[];
}

type RoomType = {
  name: string;
  hotel: string;
  description: string;
  price: number;
  guest: number;
  bedroom: number;
  bathroom: number;
  area: number;
}


