import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  Droplets,
  Wind,
  RefreshCw,
  Sparkles,
  MapPin,
  Navigation,
  LocateFixed,
  AlertCircle,
  Compass,
} from 'lucide-react';

export interface TokyoWeatherWidgetProps {
  lang?: 'TH' | 'EN';
  theme?: 'light' | 'dark';
}

interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
  weatherCode: number;
  isDay: boolean;
  highTemp: number;
  lowTemp: number;
  lastUpdated: string;
}

interface DayForecast {
  dayLabelTH: string;
  dayLabelEN: string;
  dateStr: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  rainChance: number;
}

interface LocationInfo {
  nameTH: string;
  nameEN: string;
  subNameTH: string;
  subNameEN: string;
  lat: number;
  lon: number;
  isUserLocation: boolean;
  timezone?: string;
}

const TOKYO_LOCATION: LocationInfo = {
  nameTH: 'กรุงโตเกียว',
  nameEN: 'Tokyo Metropolis',
  subNameTH: 'ประเทศญี่ปุ่น (จุดหมายปลายทางทัวร์)',
  subNameEN: 'Japan (Tour Destination)',
  lat: 35.6895,
  lon: 139.6917,
  isUserLocation: false,
  timezone: 'Asia/Tokyo',
};

// Map WMO Weather Interpretation Codes (WW) to condition info & icons
export const getWeatherCondition = (code: number, isDay = true, lang: 'TH' | 'EN' | string = 'TH') => {
  if (code === 0) {
    return {
      label: lang === 'TH' ? (isDay ? 'ท้องฟ้าแจ่มใส' : 'ฟ้าโปร่งกลางคืน') : (isDay ? 'Clear Sky' : 'Clear Night'),
      shortLabel: lang === 'TH' ? 'แจ่มใส' : 'Sunny',
      icon: Sun,
      color: 'text-amber-500 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
    };
  }
  if (code === 1 || code === 2) {
    return {
      label: lang === 'TH' ? 'ท้องฟ้าโปร่ง มีเมฆบางส่วน' : 'Partly Cloudy',
      shortLabel: lang === 'TH' ? 'มีเมฆบางส่วน' : 'Partly Cloudy',
      icon: CloudSun,
      color: 'text-sky-500 dark:text-sky-400',
      bgColor: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60',
    };
  }
  if (code === 3) {
    return {
      label: lang === 'TH' ? 'มีเมฆมาก' : 'Overcast',
      shortLabel: lang === 'TH' ? 'เมฆมาก' : 'Overcast',
      icon: Cloud,
      color: 'text-slate-500 dark:text-slate-400',
      bgColor: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800',
    };
  }
  if (code >= 51 && code <= 55) {
    return {
      label: lang === 'TH' ? 'ละอองฝนปรอยๆ' : 'Light Drizzle',
      shortLabel: lang === 'TH' ? 'ฝนปรอย' : 'Drizzle',
      icon: CloudDrizzle,
      color: 'text-cyan-500 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60',
    };
  }
  if ((code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
    return {
      label: lang === 'TH' ? 'ฝนตก' : 'Rainy',
      shortLabel: lang === 'TH' ? 'ฝนตก' : 'Rain',
      icon: CloudRain,
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60',
    };
  }
  if (code >= 71 && code <= 77) {
    return {
      label: lang === 'TH' ? 'หิมะตก' : 'Snow',
      shortLabel: lang === 'TH' ? 'หิมะ' : 'Snow',
      icon: CloudSnow,
      color: 'text-indigo-400 dark:text-indigo-300',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
    };
  }
  if (code >= 95) {
    return {
      label: lang === 'TH' ? 'พายุฝนฟ้าคะนอง' : 'Thunderstorm',
      shortLabel: lang === 'TH' ? 'ฟ้าคะนอง' : 'Storm',
      icon: CloudLightning,
      color: 'text-purple-500 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60',
    };
  }

  // Default fallback
  return {
    label: lang === 'TH' ? 'ท้องฟ้าโปร่ง' : 'Clear',
    shortLabel: lang === 'TH' ? 'โปร่ง' : 'Clear',
    icon: CloudSun,
    color: 'text-sky-500 dark:text-sky-400',
    bgColor: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60',
  };
};

// Generate intelligent smart attire & travel tips based on temperature and condition
export const getAttireRecommendation = (temp: number, weatherCode: number, lang: 'TH' | 'EN' | string = 'TH') => {
  const isRain = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
  const isStorm = weatherCode >= 95;
  const isSnow = weatherCode >= 71 && weatherCode <= 77;

  if (lang === 'TH') {
    let base = '';
    if (temp >= 33) {
      base = 'อากาศร้อนจัด แดดแรง ควรใส่เสื้อผ้าโปร่งเบาระบายอากาศ ดื่มน้ำบ่อยๆ และทาครีมกันแดด';
    } else if (temp >= 27) {
      base = 'อากาศอบอุ่นสบาย สวมเสื้อยืดหรือเสื้อผ้าบางเบา พกแว่นกันแดดหรือหมวกเมื่ออยู่กลางแจ้ง';
    } else if (temp >= 21) {
      base = 'อากาศเย็นสบายกำลังดี แนะนำสวมเสื้อเชิ้ตแขนยาวหรือพกเสื้อคาร์ดิแกนบางๆ สำหรับช่วงค่ำ';
    } else if (temp >= 14) {
      base = 'อากาศค่อนข้างเย็น ควรสวมเสื้อแจ็คเก็ต เสื้อคลุม หรือสเวตเตอร์เพื่อความอบอุ่น';
    } else if (temp >= 7) {
      base = 'อากาศหนาว ควรเตรียมเสื้อโค้ท แจ็คเก็ตหนา ผ้าพันคอ และถุงเท้าอุ่นๆ';
    } else {
      base = 'อากาศหนาวจัด ควรสวมดาวน์แจ็คเก็ต (Down coat) ถุงมือ หมวกไหมพรม และเสื้อฮีทเทค (Heattech)';
    }

    if (isStorm) return `${base} ⚠️ มีพายุฝนฟ้าคะนอง หลีกเลี่ยงที่โล่งแจ้งและอยู่ในอาคาร`;
    if (isRain) return `${base} 🌧️ มีฝนตก แนะนำพกร่มพับหรือเสื้อกันฝนติดตัว`;
    if (isSnow) return `${base} ❄️ หิมะตก ระวังพื้นลื่น ควรสวมรองเท้ากันลื่น`;
    return base;
  } else {
    let base = '';
    if (temp >= 33) {
      base = 'Very hot and sunny. Wear breathable, lightweight clothing and stay hydrated.';
    } else if (temp >= 27) {
      base = 'Warm and pleasant. T-shirts and sunglasses are ideal for outdoor walks.';
    } else if (temp >= 21) {
      base = 'Mild and comfortable. A light shirt or thin cardigan is recommended.';
    } else if (temp >= 14) {
      base = 'Cool breeze. A light jacket, fleece, or sweater is recommended.';
    } else if (temp >= 7) {
      base = 'Cold weather. Wear a warm overcoat, scarf, and warm socks.';
    } else {
      base = 'Freezing cold! Wear thermal heattech layers, heavy down jacket, and gloves.';
    }

    if (isStorm) return `${base} ⚠️ Thunderstorm alert: stay indoors if possible.`;
    if (isRain) return `${base} 🌧️ Rain showers expected. Carry a compact umbrella.`;
    if (isSnow) return `${base} ❄️ Snowing. Wear slip-resistant footwear.`;
    return base;
  }
};

const DEFAULT_WEATHER: CurrentWeather = {
  temperature: 28,
  apparentTemperature: 29,
  humidity: 65,
  windSpeed: 10,
  precipitationProbability: 20,
  weatherCode: 1, // Partly cloudy
  isDay: true,
  highTemp: 31,
  lowTemp: 24,
  lastUpdated: '--:--',
};

const DEFAULT_DAILY: DayForecast[] = [
  { dayLabelTH: 'วันนี้', dayLabelEN: 'Today', dateStr: 'วันนี้', weatherCode: 1, tempMax: 31, tempMin: 24, rainChance: 20 },
  { dayLabelTH: 'พรุ่งนี้', dayLabelEN: 'Tomorrow', dateStr: 'พรุ่งนี้', weatherCode: 2, tempMax: 32, tempMin: 25, rainChance: 15 },
  { dayLabelTH: 'มะรืนนี้', dayLabelEN: 'Day 3', dateStr: 'มะรืน', weatherCode: 3, tempMax: 30, tempMin: 24, rainChance: 30 },
  { dayLabelTH: 'วันที่ 4', dayLabelEN: 'Day 4', dateStr: 'วันที่ 4', weatherCode: 61, tempMax: 29, tempMin: 23, rainChance: 60 },
];

export const TokyoWeatherWidget: React.FC<TokyoWeatherWidgetProps> = ({
  lang = 'TH',
}) => {
  // Mode: 'user' (real-time user location) vs 'tokyo' (Tokyo tour destination)
  const [selectedMode, setSelectedMode] = useState<'user' | 'tokyo'>('user');

  // Location State
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(() => {
    try {
      const cached = localStorage.getItem('realtime_user_location_cache');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // ignore
    }
    return {
      nameTH: 'กำลังระบุตำแหน่งของคุณ...',
      nameEN: 'Detecting your location...',
      subNameTH: 'ระบุตำแหน่งผ่านระบบ GPS เรียลไทม์',
      subNameEN: 'Real-time GPS positioning',
      lat: 13.7563, // Bangkok default if in TH
      lon: 100.5018,
      isUserLocation: true,
    };
  });

  // Geolocation status
  const [geoStatus, setGeoStatus] = useState<'prompt' | 'locating' | 'granted' | 'denied' | 'error'>('locating');
  const [geoErrorMsg, setGeoErrorMsg] = useState<string>('');

  const [weather, setWeather] = useState<CurrentWeather>(() => {
    try {
      const saved = localStorage.getItem('realtime_weather_cache');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_WEATHER;
  });

  const [dailyForecast, setDailyForecast] = useState<DayForecast[]>(() => {
    try {
      const saved = localStorage.getItem('realtime_weather_daily_cache');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_DAILY;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);

  // Keep track of active fetch to prevent race condition
  const fetchCounterRef = useRef<number>(0);

  // Reverse geocoding to obtain human readable city / district name
  const reverseGeocode = useCallback(async (lat: number, lon: number): Promise<{ nameTH: string; nameEN: string; subNameTH: string; subNameEN: string }> => {
    try {
      // 1. Try BigDataCloud reverse geocode client (free, client-side friendly, multilingual)
      const resTH = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=th`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (resTH.ok) {
        const dataTH = await resTH.json();
        const cityTH = dataTH.city || dataTH.locality || dataTH.principalSubdivision || 'ตำแหน่งปัจจุบัน';
        const provinceTH = dataTH.principalSubdivision || '';
        const countryTH = dataTH.countryName || '';

        const nameTH = cityTH;
        const subNameTH = [provinceTH !== cityTH ? provinceTH : '', countryTH].filter(Boolean).join(', ') || 'พิกัด GPS';

        // Also get English name for bilingual support
        let nameEN = dataTH.city || dataTH.locality || 'Current Location';
        let subNameEN = [dataTH.principalSubdivision, dataTH.countryName].filter(Boolean).join(', ');

        return { nameTH, nameEN, subNameTH, subNameEN };
      }
    } catch {
      // ignore
    }

    // Fallback: estimate from Intl timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Bangkok')) {
      return {
        nameTH: 'กรุงเทพมหานครและปริมณฑล',
        nameEN: 'Bangkok Metropolitan',
        subNameTH: 'ประเทศไทย (พิกัด GPS เรียลไทม์)',
        subNameEN: 'Thailand (Real-time GPS)',
      };
    }
    if (tz.includes('Tokyo')) {
      return {
        nameTH: 'กรุงโตเกียว',
        nameEN: 'Tokyo Metropolis',
        subNameTH: 'ประเทศญี่ปุ่น (พิกัด GPS เรียลไทม์)',
        subNameEN: 'Japan (Real-time GPS)',
      };
    }

    return {
      nameTH: `พิกัดละติจูด ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
      nameEN: `GPS: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
      subNameTH: 'ตำแหน่งเรียลไทม์ของคุณ',
      subNameEN: 'Your Real-time Location',
    };
  }, []);

  // Fetch weather from Open-Meteo for given coordinates
  const fetchWeatherForLocation = useCallback(async (loc: LocationInfo) => {
    const fetchId = ++fetchCounterRef.current;
    setIsLoading(true);

    try {
      const tzParam = loc.timezone ? `&timezone=${encodeURIComponent(loc.timezone)}` : '&timezone=auto';
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max${tzParam}`;

      const res = await fetch(url, { signal: AbortSignal.timeout(6500) });
      if (!res.ok) throw new Error('Weather API response not OK');

      const data = await res.json();
      if (fetchId !== fetchCounterRef.current) return;

      const cur = data.current;
      const daily = data.daily;

      // Current time formatted
      const nowFormatted = new Intl.DateTimeFormat('th-TH', {
        timeZone: data.timezone || 'Asia/Bangkok',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date());

      const newWeather: CurrentWeather = {
        temperature: Math.round(cur.temperature_2m ?? 25),
        apparentTemperature: Math.round(cur.apparent_temperature ?? cur.temperature_2m ?? 25),
        humidity: Math.round(cur.relative_humidity_2m ?? 60),
        windSpeed: Math.round(cur.wind_speed_10m ?? 10),
        precipitationProbability: Math.round(daily?.precipitation_probability_max?.[0] ?? 10),
        weatherCode: cur.weather_code ?? 1,
        isDay: cur.is_day === 1,
        highTemp: Math.round(daily?.temperature_2m_max?.[0] ?? (cur.temperature_2m + 3)),
        lowTemp: Math.round(daily?.temperature_2m_min?.[0] ?? (cur.temperature_2m - 4)),
        lastUpdated: nowFormatted,
      };

      const newDaily: DayForecast[] = (daily?.time || []).slice(0, 4).map((dateStr: string, idx: number) => {
        const dateObj = new Date(dateStr);
        const dayNameTH = idx === 0 ? 'วันนี้' : idx === 1 ? 'พรุ่งนี้' : idx === 2 ? 'มะรืนนี้' : `วันที่ ${idx + 1}`;
        const dayNameEN = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : `Day ${idx + 1}`;
        const dayFormatted = dateObj.toLocaleDateString(lang === 'TH' ? 'th-TH' : 'en-US', {
          day: 'numeric',
          month: 'short',
        });

        return {
          dayLabelTH: dayNameTH,
          dayLabelEN: dayNameEN,
          dateStr: dayFormatted,
          weatherCode: daily?.weather_code?.[idx] ?? 1,
          tempMax: Math.round(daily?.temperature_2m_max?.[idx] ?? (newWeather.highTemp)),
          tempMin: Math.round(daily?.temperature_2m_min?.[idx] ?? (newWeather.lowTemp)),
          rainChance: Math.round(daily?.precipitation_probability_max?.[idx] ?? 10),
        };
      });

      setWeather(newWeather);
      setDailyForecast(newDaily.length > 0 ? newDaily : DEFAULT_DAILY);
      setIsLive(true);

      // Save to cache
      try {
        localStorage.setItem('realtime_weather_cache', JSON.stringify(newWeather));
        localStorage.setItem('realtime_weather_daily_cache', JSON.stringify(newDaily));
      } catch {
        // ignore
      }
    } catch {
      if (fetchId === fetchCounterRef.current) {
        setIsLive(false);
      }
    } finally {
      if (fetchId === fetchCounterRef.current) {
        setIsLoading(false);
      }
    }
  }, [lang]);

  // Request real-time user location
  const requestUserLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoErrorMsg(lang === 'TH' ? 'เบราว์เซอร์ไม่รองรับ GPS' : 'Browser does not support GPS');
      fetchWeatherForLocation(TOKYO_LOCATION);
      return;
    }

    setGeoStatus('locating');
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setGeoStatus('granted');
        setGeoErrorMsg('');

        // Reverse geocode to find user's city name
        const geoResult = await reverseGeocode(lat, lon);

        const newLoc: LocationInfo = {
          nameTH: geoResult.nameTH,
          nameEN: geoResult.nameEN,
          subNameTH: geoResult.subNameTH,
          subNameEN: geoResult.subNameEN,
          lat,
          lon,
          isUserLocation: true,
        };

        setCurrentLocation(newLoc);
        try {
          localStorage.setItem('realtime_user_location_cache', JSON.stringify(newLoc));
        } catch {
          // ignore
        }

        // Fetch weather for this exact user location
        fetchWeatherForLocation(newLoc);
      },
      (err) => {
        setIsLoading(false);
        if (err.code === 1) {
          // PERMISSION_DENIED
          setGeoStatus('denied');
          setGeoErrorMsg(
            lang === 'TH'
              ? 'ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง กำลังแสดงสภาพอากาศโตเกียว'
              : 'Location permission denied. Showing Tokyo weather.'
          );
        } else {
          setGeoStatus('error');
          setGeoErrorMsg(
            lang === 'TH'
              ? 'ไม่สามารถดึงตำแหน่ง GPS ได้ กำลังแสดงสภาพอากาศโตเกียว'
              : 'GPS unavailable. Showing Tokyo weather.'
          );
        }
        // Fallback to Tokyo
        setSelectedMode('tokyo');
        fetchWeatherForLocation(TOKYO_LOCATION);
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 60000,
      }
    );
  }, [fetchWeatherForLocation, lang, reverseGeocode]);

  // Initial load: trigger real-time GPS
  useEffect(() => {
    requestUserLocation();
  }, [requestUserLocation]);

  // Switch between user location & Tokyo
  const handleSelectMode = (mode: 'user' | 'tokyo') => {
    setSelectedMode(mode);
    if (mode === 'user') {
      if (geoStatus === 'denied' || geoStatus === 'error') {
        // Try requesting again
        requestUserLocation();
      } else {
        fetchWeatherForLocation(currentLocation);
      }
    } else {
      fetchWeatherForLocation(TOKYO_LOCATION);
    }
  };

  // Refresh button action
  const handleRefresh = () => {
    if (selectedMode === 'user') {
      requestUserLocation();
    } else {
      fetchWeatherForLocation(TOKYO_LOCATION);
    }
  };

  const activeLoc = selectedMode === 'user' ? currentLocation : TOKYO_LOCATION;
  const condition = getWeatherCondition(weather.weatherCode, weather.isDay, lang);
  const ConditionIcon = condition.icon;
  const attireTip = getAttireRecommendation(weather.temperature, weather.weatherCode, lang);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-all">
      {/* Location Switcher & Real-time Indicator Tabs */}
      <div className="px-3.5 pt-3 pb-2.5 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        {/* Toggle between Current Location (GPS) and Tokyo (Tour Destination) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
          <button
            onClick={() => handleSelectMode('user')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedMode === 'user'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LocateFixed className="w-3.5 h-3.5 shrink-0" />
            <span>{lang === 'TH' ? 'ตำแหน่งคุณ (GPS สด)' : 'My Location (Live)'}</span>
            {geoStatus === 'granted' && selectedMode === 'user' && (
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => handleSelectMode('tokyo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedMode === 'tokyo'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="text-xs">🗼</span>
            <span>{lang === 'TH' ? 'โตเกียว (ปลายทาง)' : 'Tokyo (Trip)'}</span>
          </button>
        </div>

        {/* Live / Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          aria-label={lang === 'TH' ? 'อัปเดตสภาพอากาศและพิกัด' : 'Refresh Weather & GPS'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          <span className="text-[11px] font-mono">
            {isLoading
              ? lang === 'TH'
                ? 'กำลังอัปเดต...'
                : 'Updating...'
              : weather.lastUpdated && weather.lastUpdated !== '--:--'
              ? `${weather.lastUpdated} น.`
              : lang === 'TH'
              ? 'รีเฟรช'
              : 'Refresh'}
          </span>
        </button>
      </div>

      {/* Permission / Status Alert Banner if GPS was denied or locating */}
      {selectedMode === 'user' && geoStatus === 'denied' && (
        <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px]">
              {lang === 'TH'
                ? 'ไม่ได้เปิดการอนุญาตพิกัด GPS แสดงพิกัดล่าสุด'
                : 'Location permission not enabled. Showing fallback.'}
            </span>
          </div>
          <button
            onClick={requestUserLocation}
            className="text-[11px] font-bold text-blue-600 dark:text-blue-400 underline hover:no-underline shrink-0 cursor-pointer"
          >
            {lang === 'TH' ? 'ลองใหม่อีกครั้ง' : 'Try Again'}
          </button>
        </div>
      )}

      {/* Main Header with Active Location Name */}
      <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200/60 dark:border-blue-800/60">
            {selectedMode === 'user' ? (
              <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            ) : (
              <span className="text-base">🗼</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                {lang === 'TH' ? activeLoc.nameTH : activeLoc.nameEN}
              </h4>
              {selectedMode === 'user' ? (
                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300/60 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>{lang === 'TH' ? 'พิกัดสด GPS' : 'Live GPS'}</span>
                </span>
              ) : (
                <span className="text-[10px] bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold px-2 py-0.5 rounded-full border border-sky-300/40">
                  JST (UTC+9)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{lang === 'TH' ? activeLoc.subNameTH : activeLoc.subNameEN}</span>
            </p>
          </div>
        </div>

        {/* GPS Coordinates pill */}
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-800">
            {activeLoc.lat.toFixed(3)}°, {activeLoc.lon.toFixed(3)}°
          </span>
        </div>
      </div>

      {/* Main Weather Display Body */}
      <div className="p-4 sm:p-5 pt-2 space-y-4">
        {/* Main Temperature & Condition Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Big Temperature & Icon */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-3xl ${condition.bgColor} flex items-center justify-center shrink-0 shadow-xs border transition-all duration-300`}>
              <ConditionIcon className={`w-10 h-10 sm:w-11 sm:h-11 ${condition.color} transition-transform duration-500 hover:scale-110`} />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {weather.temperature}°
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-500 dark:text-slate-400">
                  C
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                <span>{condition.label}</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'TH'
                  ? `รู้สึกจริง ${weather.apparentTemperature}°C • สูงสุด ${weather.highTemp}° / ต่ำสุด ${weather.lowTemp}°`
                  : `Feels like ${weather.apparentTemperature}°C • H: ${weather.highTemp}° / L: ${weather.lowTemp}°`}
              </p>
            </div>
          </div>

          {/* Right: Quick metrics pills */}
          <div className="flex flex-col gap-1.5 text-right shrink-0">
            {/* Humidity */}
            <div className="inline-flex items-center justify-end gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              <span className="font-semibold">{weather.humidity}%</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {lang === 'TH' ? 'ความชื้น' : 'Humidity'}
              </span>
            </div>

            {/* Rain chance */}
            <div className="inline-flex items-center justify-end gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <CloudRain className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-semibold">{weather.precipitationProbability}%</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {lang === 'TH' ? 'โอกาสฝน' : 'Rain'}
              </span>
            </div>

            {/* Wind speed */}
            <div className="inline-flex items-center justify-end gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <Wind className="w-3.5 h-3.5 text-teal-500" />
              <span className="font-semibold">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* Travel Outfit & Advice Tip Banner */}
        <div className="rounded-2xl p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-xs">
          <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">
              {lang === 'TH' ? 'คำแนะนำการแต่งกายตามสภาพอากาศ:' : 'Attire Recommendation for Current Weather:'}
            </span>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed text-[11px] sm:text-xs">
              {attireTip}
            </p>
          </div>
        </div>

        {/* 4-Day Quick Forecast Pills */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-slate-400" />
              <span>
                {lang === 'TH'
                  ? `พยากรณ์อากาศล่วงหน้า (${selectedMode === 'user' ? 'พิกัดของคุณ' : 'โตเกียว'})`
                  : `4-Day Outlook (${selectedMode === 'user' ? 'Local' : 'Tokyo'})`}
              </span>
            </span>
            {isLive && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{lang === 'TH' ? 'อัปเดตเรียลไทม์' : 'Real-time Live'}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {dailyForecast.map((item, idx) => {
              const itemCondition = getWeatherCondition(item.weatherCode, true, lang);
              const ItemIcon = itemCondition.icon;
              const isToday = idx === 0;

              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-between p-2.5 rounded-2xl text-center border transition-all ${
                    isToday
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 shadow-2xs font-bold'
                      : 'bg-white dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className={`text-[11px] font-bold leading-tight ${isToday ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {lang === 'TH' ? item.dayLabelTH : item.dayLabelEN}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 mb-1.5">
                    {item.dateStr}
                  </span>

                  <ItemIcon className={`w-5 h-5 my-1 ${itemCondition.color}`} />

                  <div className="mt-1 flex items-center justify-center gap-1 font-mono text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.tempMax}°
                    </span>
                    <span className="text-slate-400 text-[10px]">/</span>
                    <span className="text-slate-400 dark:text-slate-500">
                      {item.tempMin}°
                    </span>
                  </div>

                  {item.rainChance > 0 && (
                    <span className="text-[9px] text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                      🌧️{item.rainChance}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Also export as RealtimeWeatherWidget
export const RealtimeWeatherWidget = TokyoWeatherWidget;
