import { Layout } from "@/components/layout/Layout";
import {
  Leaf,
  Brain,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Globe,
  Info,
} from "lucide-react";

export default function About() {
  return (
    <Layout>
      {/* ================= HERO ================= */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-95" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 rounded-full px-4 py-2 mb-6">
            <Leaf className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">
              Academic Project Overview
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-6">
            SmartPitaya
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
            SmartPitaya is a final-year academic project focused on applying
            artificial intelligence techniques to support dragon fruit disease
            detection and agriculture-related decision assistance.
          </p>
        </div>
      </section>

      {/* ================= WHY DRAGON FRUIT ================= */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Dragon Fruit?
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Dragon fruit (Pitaya) is an emerging high-value horticultural
                  crop with increasing cultivation across India, including
                  Karnataka.
                </p>
                <p>
                  Farmers often face challenges related to early disease
                  identification, access to timely information, and understanding
                  local market conditions.
                </p>
                <p>
                  This project explores how AI-assisted tools can help improve
                  awareness, support decision-making, and reduce uncertainty in
                  dragon fruit farming practices.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Zap, label: "Emerging Crop" },
                { icon: Heart, label: "Health Benefits" },
                { icon: Globe, label: "Export Potential" },
                { icon: TrendingUp, label: "Growing Research Interest" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="bg-card rounded-2xl border p-6 text-center"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <p className="font-semibold text-foreground">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SYSTEM WORKFLOW ================= */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              System Workflow
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              High-level overview of the disease detection process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Image Input",
                description:
                  "The user uploads a dragon fruit leaf or fruit image captured under normal field conditions.",
              },
              {
                step: "2",
                title: "Model Inference",
                description:
                  "A trained convolutional neural network processes the image and predicts the disease category.",
              },
              {
                step: "3",
                title: "Result Display",
                description:
                  "The system presents the identified disease along with confidence and guidance information.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROJECT SCOPE & CONTEXT ================= */}
      <section className="py-16 bg-secondary/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-card border rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-primary mt-1" />
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p className="font-semibold text-foreground">
                  Project Scope & Context
                </p>
                <p>
                  The current implementation focuses on demonstrating the
                  practical application of artificial intelligence techniques
                  in agriculture within an academic setting.
                </p>
                <p>
                  Market prices and weather-related insights are presented using
                  reference datasets and rule-based logic to support analysis
                  and comparison, while maintaining clarity and explainability.
                </p>
                <p>
                  The system architecture is designed in a modular manner, making
                  it suitable for future enhancement with live data sources,
                  mobile deployment, and broader dataset integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTNOTE ================= */}
      <section className="py-10 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Note: This project is developed for academic and research purposes.
            The data and outputs shown are representative and intended for
            demonstration and evaluation only.
          </p>
        </div>
      </section>
    </Layout>
  );
}
