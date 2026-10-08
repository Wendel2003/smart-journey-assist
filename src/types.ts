export interface Trip {
  id: string;
  TripID: string;
  TripName: string;
  Status: string;
  Country: string;
  CountryCode: string;
  StartDate: string;
  EndDate: string;
  OutboundFlight: string;
  ReturnFlight: string;
  MainHotelID: string;
  TourLeaderContactID: string;
  EmbassyName: string;
  EmbassyPhone: string;
  EmbassyMapURL: string;
  EmergencyNumber: string;
  CoverImageURL?: string;
  LastUpdated: string;
}

export interface Traveler {
  id: string;
  TravelerID: string;
  TripID: string;
  FullNameTH: string;
  FullNameEN: string;
  Nickname: string;
  Mobile: string;
  QRCodeValue: string;
  EmergencyCardEnabled: string;
  PreferredLanguage: string;
  AccessStatus: string;
  Note: string;
  PassportNumber?: string;
  PassportExpiry?: string;
  PassportIssueDate?: string;
  Nationality?: string;
  DateOfBirth?: string;
  Sex?: 'M' | 'F';
  PhotoURL?: string;
}

export interface Notice {
  id: string;
  NoticeID: string;
  TripID: string;
  TitleTH: string;
  TitleEN: string;
  MessageTH: string;
  MessageEN: string;
  Priority: 'High' | 'Medium' | 'Low';
  NoticeType: string;
  IsActive: string;
  PublishedAt: string;
  ActiveFrom: string;
  ActiveTo: string;
}

export interface MeetingPoint {
  id: string;
  MeetingPointID: string;
  TripID: string;
  TitleTH: string;
  TitleEN: string;
  Time: string;
  Date: string;
  LocationName: string;
  LandmarkDetailTH: string;
  Latitude: string;
  Longitude: string;
  MapURL: string;
  ImageURL: string;
  Active: string;
  SortOrder: string;
}

export interface ItineraryItem {
  id: string;
  ItineraryID: string;
  TripID: string;
  DayNo: string;
  Date: string;
  Time: string;
  ActivityType: 'Meal' | 'Meeting' | 'Attraction' | 'Transport' | 'Free';
  ActivityNameTH: string;
  ActivityNameEN: string;
  LocationName: string;
  Latitude?: string;
  Longitude?: string;
  EstimatedDuration?: string;
  Note?: string;
  MeetingPointID?: string;
  ImageURL?: string;
  MapURL: string;
  SortOrder: string;
}

export interface Hotel {
  id: string;
  HotelID: string;
  TripID: string;
  HotelNameEN: string;
  HotelNameLocal: string;
  AddressEN: string;
  AddressLocal?: string;
  Phone: string;
  CheckInDate: string;
  CheckOutDate: string;
  CheckInTime: string;
  CheckOutTime: string;
  TaxiMessageLocal: string;
  TaxiMessageEN: string;
  ImageURL: string;
  MapURL: string;
  Note?: string;
}

export interface EmergencyProcedure {
  id: string;
  EmergencyID: string;
  CountryCode: string;
  EmergencyType: 'LostFromGroup' | 'PassportLost' | 'Medical' | 'TourBus' | 'ContactLeader' | 'LocalHelp';
  TitleTH: string;
  TitleEN: string;
  Step1TH: string;
  Step2TH: string;
  Step3TH: string;
  PrimaryPhone: string;
  SecondaryPhone?: string;
  LocalHelpText: string;
  MapURL?: string;
  Priority: string;
  Enabled: string;
}

export interface Contact {
  id: string;
  ContactID: string;
  TripID: string;
  Name: string;
  Role: 'Tour Leader' | 'Local Guide' | 'Company' | 'Hotel';
  Organization: string;
  Phone: string;
  Language: string;
  Email?: string;
  LineID?: string;
  Note?: string;
  CallEnabled: string;
  MessageEnabled: string;
  SortOrder: string;
}

export interface Phrase {
  id: string;
  PhraseID: string;
  CountryCode: string;
  Category: 'Contact' | 'Hotel' | 'Passport' | 'Medical';
  LocalText: string;
  ThaiText: string;
  EnglishText: string;
  AudioURL?: string;
  SortOrder: string;
  Enabled: string;
}

export interface AppConfig {
  AppName: string;
  BrandLine: string;
  EmergencyButtonText: string;
  PrivacyNote: string;
  DefaultLanguage: 'TH' | 'EN';
}
