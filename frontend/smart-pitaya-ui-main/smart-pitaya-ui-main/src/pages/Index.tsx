import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Camera,
  TrendingUp,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function Index() {
  return (
    <Layout>
      {/* HERO */}
      <section className="bg-green-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 mb-4">
              <Leaf className="w-4 h-4" />
              <span className="text-sm">
                For Dragon Fruit Farmers & Researchers
              </span>
            </div>

            {/* LANGUAGE UI (UI ONLY – NO LOGIC) */}
            <div className="flex justify-center gap-3 text-sm text-white/80 mb-6">
              <span className="cursor-pointer hover:underline">English</span>
              <span>|</span>
              <span className="cursor-pointer hover:underline">ಕನ್ನಡ</span>
              <span>|</span>
              <span className="cursor-pointer hover:underline">हिंदी</span>
            </div>

            {/* TITLE */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              SmartPitaya – AI Support System for Dragon Fruit Farming
            </h1>

            {/* DESCRIPTION */}
            <p className="text-base md:text-lg text-white/90 mb-4 leading-relaxed">
              This system helps farmers identify dragon fruit diseases using
              image analysis and compare nearby market prices to make better
              selling decisions.
            </p>

            {/* AI FLOW (VERY IMPORTANT FOR EXAMINER) */}
            <p className="text-sm text-white/80 mb-8">
              Upload Image → AI Model (Keras) → Disease Detection → Treatment Guidance
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-green-700 hover:bg-white/90"
              >
                <Link to="/disease-detection">
                  <Camera className="w-5 h-5 mr-2" />
                  Check Plant Disease
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link to="/prices">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  View Market Prices
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / ACADEMIC SECTION */}
      <section className="py-14 bg-secondary/40">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <ShieldCheck className="w-10 h-10 mx-auto mb-4 text-primary" />

            <h2 className="text-2xl font-bold mb-3">
              Built for Academic & Farmer Use
            </h2>

            <p className="text-muted-foreground">
              SmartPitaya is developed as a Computer Science & Engineering
              final-year major project. The system demonstrates real application
              of Artificial Intelligence in agriculture.
            </p>

            {/* ML PROOF LINE */}
            <p className="text-sm text-muted-foreground mt-2">
              Deep Learning model trained using Keras and integrated with a web interface.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT HELPS */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            How This System Helps Farmers
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded-xl p-6 bg-card">
              <Camera className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Disease Identification</h3>
              <p className="text-sm text-muted-foreground">
                Upload leaf or fruit image and get disease name, confidence,
                and treatment suggestions using AI.
              </p>
            </div>

            <div className="border rounded-xl p-6 bg-card">
              <MapPin className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Local Market Comparison</h3>
              <p className="text-sm text-muted-foreground">
                Compare dragon fruit prices in Vijayapura and nearby towns
                to decide where to sell.
              </p>
            </div>

            <div className="border rounded-xl p-6 bg-card">
              <TrendingUp className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Decision Support</h3>
              <p className="text-sm text-muted-foreground">
                Helps farmers reduce crop loss and improve income using
                data-based decision support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-14 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Start Using SmartPitaya
          </h2>

          <p className="text-muted-foreground mb-6">
            Simple • Useful • Farmer-Friendly • AI Powered
          </p>

          <Button asChild size="lg">
            <Link to="/disease-detection">
              Go to Disease Detection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}