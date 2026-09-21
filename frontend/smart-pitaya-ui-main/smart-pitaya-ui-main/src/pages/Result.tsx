import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Shield,
  ArrowLeft,
  Scan,
} from "lucide-react";

/* ================= TYPES ================= */
interface AnalysisResult {
  disease: string;
  confidence: number;
  severity: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
}

type Season = "Summer" | "Monsoon" | "Winter";

/* ================= FERTILIZER DATA ================= */
const fertilizerGuide: Record<
  string,
  Record<Season, { fertilizer: string; dosage: string; note: string }>
> = {
  Anthracnose: {
    Summer: {
      fertilizer: "Copper-based fungicide",
      dosage: "2 g / liter spray",
      note: "Spray during early morning"
    },
    Monsoon: {
      fertilizer: "Copper oxychloride",
      dosage: "2.5 g / liter spray",
      note: "Ensure proper drainage"
    },
    Winter: {
      fertilizer: "Bordeaux mixture",
      dosage: "1% solution",
      note: "Avoid excess moisture"
    }
  },
  "Brown Spot": {
    Summer: {
      fertilizer: "Mancozeb",
      dosage: "2 g / liter",
      note: "Repeat after 10 days"
    },
    Monsoon: {
      fertilizer: "Chlorothalonil",
      dosage: "2 g / liter",
      note: "Spray after rainfall"
    },
    Winter: {
      fertilizer: "Neem-based fungicide",
      dosage: "3 ml / liter",
      note: "Preventive spray"
    }
  },
  Healthy: {
    Summer: {
      fertilizer: "Balanced NPK (19:19:19)",
      dosage: "2 g / liter",
      note: "Once in 15 days"
    },
    Monsoon: {
      fertilizer: "Organic compost",
      dosage: "2–3 kg per plant",
      note: "Improve soil health"
    },
    Winter: {
      fertilizer: "Vermicompost",
      dosage: "2 kg per plant",
      note: "Boost root strength"
    }
  }
};

export default function Result() {
  const location = useLocation();
  const state = location.state as
    | { image?: string; plantPart?: string; result?: AnalysisResult }
    | undefined;

  /* ===== SAFETY ===== */
  if (!state || !state.result || !state.image) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">No analysis data found</h2>
          <Button asChild>
            <Link to="/disease-detection">Go Back</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const { image, plantPart, result } = state;
  const isHealthy = result.disease === "Healthy";

  const [season, setSeason] = useState<Season>("Summer");

  const fertilizerData =
    fertilizerGuide[result.disease]?.[season] ||
    fertilizerGuide["Healthy"][season];

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">

          {/* BACK */}
          <Link
            to="/disease-detection"
            className="flex items-center gap-2 mb-6 text-muted-foreground"
          >
            <ArrowLeft size={18} /> Back
          </Link>

          {/* IMAGE + RESULT */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border rounded-xl overflow-hidden">
              <img src={image} alt="Plant" className="w-full h-full object-cover" />
            </div>

            <div className="bg-card border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                {isHealthy ? (
                  <CheckCircle2 className="text-green-600" />
                ) : (
                  <AlertTriangle className="text-amber-500" />
                )}
                <h1 className="text-2xl font-bold">{result.disease}</h1>
              </div>

              <p className="text-muted-foreground mb-2">
                Confidence: {result.confidence}%
              </p>

              <div className="w-full bg-secondary rounded-full h-3 mb-4">
                <div
                  className="h-3 rounded-full bg-primary"
                  style={{ width: `${result.confidence}%` }}
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Plant Part: {plantPart}
              </p>
            </div>
          </div>

          {/* SYMPTOMS */}
          <div className="bg-card border rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-3">Symptoms</h2>
            <ul className="list-disc ml-6 text-muted-foreground">
              {result.symptoms.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* TREATMENT */}
          <div className="bg-card border rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-3">Treatment</h2>
            <ul className="list-decimal ml-6 text-muted-foreground">
              {result.treatment.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          {/* PREVENTION */}
          <div className="bg-card border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Shield size={18} /> Prevention
            </h2>
            <ul className="list-disc ml-6 text-muted-foreground">
              {result.prevention.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          {/* ================= FERTILIZER + SEASON ================= */}
          <div className="bg-card border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              Fertilizer Recommendation (Season-wise)
            </h2>

            {/* SEASON SELECT */}
            <div className="flex gap-3 mb-4">
              {(["Summer", "Monsoon", "Winter"] as Season[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`px-4 py-2 rounded-xl font-medium ${
                    season === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* TABLE */}
            <table className="w-full border rounded-xl overflow-hidden">
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Recommended Fertilizer</td>
                  <td className="p-3">{fertilizerData.fertilizer}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-semibold">Dosage</td>
                  <td className="p-3">{fertilizerData.dosage}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Important Note</td>
                  <td className="p-3">{fertilizerData.note}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SCAN AGAIN */}
          <div className="text-center">
            <Button asChild size="lg">
              <Link to="/disease-detection">
                <Scan className="mr-2" />
                Scan Another Image
              </Link>
            </Button>
          </div>

        </div>
      </section>
    </Layout>
  );
}