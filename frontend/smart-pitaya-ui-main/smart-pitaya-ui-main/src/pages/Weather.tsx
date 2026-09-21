import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* ---------------- TYPES ---------------- */
type City = {
  name: string;
  latitude: number;
  longitude: number;
};

type WeatherData = {
  temperature: number;
  humidity: number;
  rain: number;
  wind: number;
};

type Advisory = {
  risk: "LOW" | "MEDIUM" | "HIGH";
  title: string;
  actions: string[];
};

/* ---------------- COMPONENT ---------------- */
export default function Weather() {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [place, setPlace] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- CITY SEARCH ---------------- */
  useEffect(() => {
    if (query.length < 2) {
      setCities([]);
      return;
    }

    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en`
    )
      .then(res => res.json())
      .then(data => setCities(data.results || []))
      .catch(() => setCities([]));
  }, [query]);

  /* ---------------- WEATHER FETCH ---------------- */
  const fetchWeather = async (lat: number, lon: number, name: string) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,rain`
      );
      const data = await res.json();

      setWeather({
        temperature: data.current_weather.temperature,
        wind: data.current_weather.windspeed,
        humidity: data.hourly.relativehumidity_2m[0],
        rain: data.hourly.rain[0],
      });

      setPlace(name);
      setCities([]);
    } catch {
      setError("Unable to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STRONG REVERSE GEOCODING (INDIA SAFE) ---------------- */
  const resolvePlaceName = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`
      );
      const data = await res.json();

      return (
        data.address.village ||
        data.address.town ||
        data.address.city ||
        data.address.county ||
        data.address.state ||
        "Nearby Location"
      );
    } catch {
      return "Nearby Location";
    }
  };

  /* ---------------- USE CURRENT LOCATION ---------------- */
  const useMyLocation = () => {
    setLoading(true);
    setError("");
    setWeather(null);
    setPlace("");

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const resolvedName = await resolvePlaceName(lat, lon);
        fetchWeather(lat, lon, resolvedName);
      },
      () => {
        setError("Location access failed");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  /* ---------------- DRAGON FRUIT ADVISORY ---------------- */
  const getAdvisory = (): Advisory | null => {
    if (!weather) return null;

    const { temperature, humidity, rain } = weather;

    if (temperature > 38) {
      return {
        risk: "HIGH",
        title: "High Temperature Stress (Dragon Fruit)",
        actions: [
          "Use shade nets to reduce heat stress",
          "Irrigate only early morning or evening",
          "Avoid flowering-stage fertilizer",
        ],
      };
    }

    if (rain > 8) {
      return {
        risk: "HIGH",
        title: "Excess Rainfall Risk",
        actions: [
          "Ensure proper drainage around plant base",
          "Avoid irrigation for 1–2 days",
        ],
      };
    }

    if (humidity > 85) {
      return {
        risk: "MEDIUM",
        title: "Fungal Disease Favorable Conditions",
        actions: [
          "Avoid water stagnation",
          "Monitor stems and fruits for fungal spots",
        ],
      };
    }

    return {
      risk: "LOW",
      title: "Suitable Conditions for Dragon Fruit",
      actions: [
        "Maintain normal irrigation",
        "Continue regular crop monitoring",
      ],
    };
  };

  const advisory = getAdvisory();

  /* ---------------- UI ---------------- */
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-xl">

          <h1 className="text-3xl font-bold text-center mb-2">
            Weather & Crop Advisory
          </h1>

          <p className="text-center text-muted-foreground mb-6">
            Location-based weather analysis for dragon fruit farmers
          </p>

          {/* SEARCH */}
          <Input
            placeholder="Search city or nearby town (e.g. Vijayapura)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          {/* AUTOCOMPLETE */}
          {cities.length > 0 && (
            <div className="border rounded mt-1 bg-white shadow">
              {cities.map((c, i) => (
                <div
                  key={i}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    fetchWeather(c.latitude, c.longitude, c.name)
                  }
                >
                  {c.name}
                </div>
              ))}
            </div>
          )}

          {/* LOCATION */}
          <Button className="w-full mt-3" onClick={useMyLocation}>
            📍 Use Current Location
          </Button>

          {loading && (
            <p className="text-center mt-4">Fetching local weather…</p>
          )}

          {error && (
            <p className="text-red-600 text-center mt-4">{error}</p>
          )}

          {/* RESULT */}
          {weather && advisory && (
            <div className="mt-6 p-6 rounded-xl border bg-card">

              <h2 className="font-semibold text-xl mb-4">
                {place}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <p>🌡 {weather.temperature} °C</p>
                <p>💧 {weather.humidity} %</p>
                <p>🌧 {weather.rain} mm</p>
                <p>🌬 {weather.wind} km/h</p>
              </div>

              <div
                className={`p-4 rounded border-l-8 ${
                  advisory.risk === "HIGH"
                    ? "bg-red-100 border-red-600"
                    : advisory.risk === "MEDIUM"
                    ? "bg-yellow-100 border-yellow-600"
                    : "bg-green-100 border-green-600"
                }`}
              >
                <p className="font-bold">Risk Level: {advisory.risk}</p>
                <p className="font-semibold mt-1">{advisory.title}</p>
                <ul className="list-disc ml-5 mt-2">
                  {advisory.actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}
