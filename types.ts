
export interface MenuEntry {
  id: string;
  dishName: string;
  description: string;
  meatType: string;
  meatSpec: string;
  weightPerCut: string;
  dailyPortionTarget: string; // Changed label in UI
  meatDate: string;
  otherIngredients: Array<{ id: string; name: string; qty: string }>;
  otherDate: string;
}

export interface KitchenInfo {
  needsKitchen: boolean;
  purpose: string;
  specificEquipment: string;
  photos: string[];
}

export interface HotelInfo {
  numRooms: string;
  roomSpec: string; // Individual vs Shared
  checkIn: string;
  checkOut: string;
  photos: string[];
}

export interface EquipmentEntry {
  id: string;
  item: string;
  spec: string;
  qty: number;
  dateNeeded: string;
}

export interface FuelEntry {
  id: string;
  type: string;
  spec: string;
  qty: string;
  dateNeeded: string;
}

export interface ProcessEntry {
  id: string;
  date: string;
  process: string;
  result: string;
  requirements: string[];
}

export interface StaffMember {
  id: string;
  fullName: string;
  role: string;
  flightNeeded: boolean;
  passportNumber: string;
  passportExpiry: string;
  passportPhoto?: string;
  dob: string;
  address: string;
}

export interface FlightInfo {
  outboundAirport: string;
  outboundDate: string;
  usArrivalAirport: string;
  inboundDate: string;
}

export interface OnboardingData {
  teamName: string;
  needsSupplementaryStaff: boolean;
  supplementaryStaffQty: number;
  menu: MenuEntry[];
  kitchen: KitchenInfo;
  equipment: EquipmentEntry[];
  fuel: FuelEntry[];
  process: ProcessEntry[];
  staff: StaffMember[];
  flights: FlightInfo;
  hotel: HotelInfo;
}

export type Step = 'intro' | 'info' | 'menu' | 'kitchen' | 'equipment' | 'fuel' | 'process' | 'staff' | 'flights' | 'hotel' | 'review';
