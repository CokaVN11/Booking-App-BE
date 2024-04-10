type RoomType = {
  name: string;
  hotel: string;
  description: string;
  price: number;
  guest: number;
  bedroom: number;
  bathroom: number;
  area: number;
};

type Room = {
  hotel: string;
  room_type: string;
  name: string;
  image: string;
  amenities: string[];
};