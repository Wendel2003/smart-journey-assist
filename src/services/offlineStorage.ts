import {
  Trip,
  ItineraryItem,
  EmergencyProcedure,
  Contact,
  MeetingPoint,
  Hotel,
  Phrase,
  Notice,
} from '../types.ts';
import {
  currentTrip,
  itineraryList,
  emergencyProceduresList,
  contactsList,
  meetingPointsList,
  mainHotel,
  phrasesList,
  noticesList,
} from '../data/mockData.ts';

const CACHE_KEYS = {
  TRIP: 'sja_cache_trip',
  ITINERARY: 'sja_cache_itinerary',
  EMERGENCY: 'sja_cache_emergency_procedures',
  CONTACTS: 'sja_cache_contacts',
  MEETING_POINTS: 'sja_cache_meeting_points',
  HOTEL: 'sja_cache_hotel',
  PHRASES: 'sja_cache_phrases',
  NOTICES: 'sja_cache_notices',
  LAST_SYNC: 'sja_cache_last_sync_timestamp',
  VERSION: 'sja_cache_version',
};

const CACHE_VERSION = '1.0.0';

export interface OfflineCacheStats {
  lastSync: string | null;
  itineraryCount: number;
  emergencyCount: number;
  contactsCount: number;
  meetingPointsCount: number;
  isReady: boolean;
}

/**
 * Safely parse JSON from localStorage with a fallback
 */
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`[OfflineStorage] Failed to read ${key}:`, err);
    return fallback;
  }
}

/**
 * Safely save JSON to localStorage
 */
function saveToStorage<T>(key: string, data: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(`[OfflineStorage] Failed to write ${key}:`, err);
    return false;
  }
}

/**
 * Store all essential trip itinerary and emergency data into persistent local storage
 */
export function cacheEssentialTourData(): OfflineCacheStats {
  const now = new Date().toISOString();

  saveToStorage(CACHE_KEYS.TRIP, currentTrip);
  saveToStorage(CACHE_KEYS.ITINERARY, itineraryList);
  saveToStorage(CACHE_KEYS.EMERGENCY, emergencyProceduresList);
  saveToStorage(CACHE_KEYS.CONTACTS, contactsList);
  saveToStorage(CACHE_KEYS.MEETING_POINTS, meetingPointsList);
  saveToStorage(CACHE_KEYS.HOTEL, mainHotel);
  saveToStorage(CACHE_KEYS.PHRASES, phrasesList);
  saveToStorage(CACHE_KEYS.NOTICES, noticesList);
  localStorage.setItem(CACHE_KEYS.LAST_SYNC, now);
  localStorage.setItem(CACHE_KEYS.VERSION, CACHE_VERSION);

  return {
    lastSync: now,
    itineraryCount: itineraryList.length,
    emergencyCount: emergencyProceduresList.length,
    contactsCount: contactsList.length,
    meetingPointsCount: meetingPointsList.length,
    isReady: true,
  };
}

/**
 * Initialize cache on application startup if not already seeded
 */
export function initOfflineStorage(): OfflineCacheStats {
  const existingSync = localStorage.getItem(CACHE_KEYS.LAST_SYNC);
  const existingVersion = localStorage.getItem(CACHE_KEYS.VERSION);

  if (!existingSync || existingVersion !== CACHE_VERSION) {
    return cacheEssentialTourData();
  }

  return getOfflineCacheStats();
}

/**
 * Retrieve current offline cache stats
 */
export function getOfflineCacheStats(): OfflineCacheStats {
  const lastSync = localStorage.getItem(CACHE_KEYS.LAST_SYNC);
  const itinerary = getFromStorage<ItineraryItem[]>(CACHE_KEYS.ITINERARY, []);
  const emergency = getFromStorage<EmergencyProcedure[]>(CACHE_KEYS.EMERGENCY, []);
  const contacts = getFromStorage<Contact[]>(CACHE_KEYS.CONTACTS, []);
  const meetingPoints = getFromStorage<MeetingPoint[]>(CACHE_KEYS.MEETING_POINTS, []);

  return {
    lastSync,
    itineraryCount: itinerary.length || itineraryList.length,
    emergencyCount: emergency.length || emergencyProceduresList.length,
    contactsCount: contacts.length || contactsList.length,
    meetingPointsCount: meetingPoints.length || meetingPointsList.length,
    isReady: !!lastSync,
  };
}

/**
 * Get offline-cached Trip info
 */
export function getCachedTrip(): Trip {
  return getFromStorage<Trip>(CACHE_KEYS.TRIP, currentTrip);
}

/**
 * Get offline-cached Itinerary items
 */
export function getCachedItinerary(): ItineraryItem[] {
  return getFromStorage<ItineraryItem[]>(CACHE_KEYS.ITINERARY, itineraryList);
}

/**
 * Get offline-cached Emergency procedures and SOS guides
 */
export function getCachedEmergencyProcedures(): EmergencyProcedure[] {
  return getFromStorage<EmergencyProcedure[]>(CACHE_KEYS.EMERGENCY, emergencyProceduresList);
}

/**
 * Get offline-cached Tour Leader, Guides, and Emergency Contacts
 */
export function getCachedContacts(): Contact[] {
  return getFromStorage<Contact[]>(CACHE_KEYS.CONTACTS, contactsList);
}

/**
 * Get offline-cached Meeting Points
 */
export function getCachedMeetingPoints(): MeetingPoint[] {
  return getFromStorage<MeetingPoint[]>(CACHE_KEYS.MEETING_POINTS, meetingPointsList);
}

/**
 * Get offline-cached Hotel and Taxi driver translation card
 */
export function getCachedHotel(): Hotel {
  return getFromStorage<Hotel>(CACHE_KEYS.HOTEL, mainHotel);
}

/**
 * Get offline-cached Japanese phrases
 */
export function getCachedPhrases(): Phrase[] {
  return getFromStorage<Phrase[]>(CACHE_KEYS.PHRASES, phrasesList);
}

/**
 * Get offline-cached Trip Notices
 */
export function getCachedNotices(): Notice[] {
  return getFromStorage<Notice[]>(CACHE_KEYS.NOTICES, noticesList);
}
