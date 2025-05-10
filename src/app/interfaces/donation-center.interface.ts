export interface Schedule {
  days: string;
  hours: string;
}

export interface DonationCenter {
  name: string;
  address: string;
  distance: string;
  coordinates: [number, number];
  schedules: Schedule[];
  contacts: string[];
}