import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowUp,
  ArrowDown,
  Truck,
  MapPin,
  Info,
  IndianRupee,
} from "lucide-react";

/* =====================================================
   PRICE + TRANSPORT BASED DECISION SUPPORT
===================================================== */

type MarketPrice = {
  city: string;
  price: number;
  distance: number; // km from Vijayapura
};

/* Assumed average transport cost */
const TRANSPORT_COST_PER_KM = 1.5; // ₹ per kg per km

const MARKET_DATA: MarketPrice[] = [
  { city: "Vijayapura", price: 140, distance: 0 },
  { city: "Indi", price: 135, distance: 45 },
  { city: "Sindagi", price: 138, distance: 60 },
  { city: "Muddebihal", price: 132, distance: 35 },
  { city: "Basavana Bagewadi", price: 145, distance: 50 },
  { city: "Bijargi", price: 137, distance: 25 },
  { city: "Ilkal", price: 136, distance: 70 },
  { city: "Hungund", price: 134, distance: 65 },
  { city: "Bagalkot", price: 142, distance: 80 },
  { city: "Kalaburagi", price: 148, distance: 110 },
];

export default function Prices() {
  const [search, setSearch] = useState("");

  const enriched = MARKET_DATA.map((m) => {
    const transportCost = m.distance * TRANSPORT_COST_PER_KM;
    const netProfit = m.price - transportCost;
    return { ...m, transportCost, netProfit };
  });

  const filtered = enriched.filter((m) =>
    m.city.toLowerCase().includes(search.toLowerCase())
  );

  const bestProfit = [...enriched].sort(
    (a, b) => b.netProfit - a.netProfit
  );

  const worstProfit = [...enriched].sort(
    (a, b) => a.netProfit - b.netProfit
  );

  return (
    <Layout>
      <section className="py-14">
        <div className="container mx-auto px-4">

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold">
              Selling Decision – Net Profit Analysis
            </h1>
            <p className="text-muted-foreground mt-2">
              Price minus transport cost (₹ / kg)
            </p>
          </div>

          {/* SEARCH */}
          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
            <Input
              placeholder="Search city or village..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12"
            />
          </div>

          {/* TABLE */}
          <div className="bg-card border rounded-xl overflow-hidden mb-10">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="p-4 text-left">Market</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-right">Transport</th>
                  <th className="p-4 text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.city} className="border-b">
                    <td className="p-4 flex gap-2 items-center">
                      <MapPin className="w-4 h-4" />
                      {m.city}
                    </td>
                    <td className="p-4 text-right">
                      ₹{m.price}
                    </td>
                    <td className="p-4 text-right">
                      ₹{m.transportCost.toFixed(1)}
                    </td>
                    <td className="p-4 text-right font-bold text-primary">
                      ₹{m.netProfit.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BEST & WORST */}
          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-green-50 border rounded-xl p-6">
              <div className="flex gap-2 items-center mb-4">
                <ArrowUp className="text-green-600" />
                <h2 className="font-bold">
                  Best Profit Markets
                </h2>
              </div>

              {bestProfit.slice(0, 5).map((m, i) => (
                <div key={m.city} className="flex justify-between py-2">
                  <span>{i + 1}. {m.city}</span>
                  <span className="font-bold text-green-700">
                    ₹{m.netProfit.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-red-50 border rounded-xl p-6">
              <div className="flex gap-2 items-center mb-4">
                <ArrowDown className="text-red-600" />
                <h2 className="font-bold">
                  Least Profitable Markets
                </h2>
              </div>

              {worstProfit.slice(0, 5).map((m, i) => (
                <div key={m.city} className="flex justify-between py-2">
                  <span>{i + 1}. {m.city}</span>
                  <span className="font-bold text-red-700">
                    ₹{m.netProfit.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* INSIGHT */}
          <div className="mt-10 bg-secondary/40 rounded-xl p-6 flex gap-3">
            <Truck className="w-6 h-6" />
            <p className="text-sm text-muted-foreground">
              <b>Insight:</b> Higher price does not always mean higher profit.
              This analysis helps farmers choose the market that gives the
              best return after considering transportation cost.
            </p>
          </div>

          {/* DISCLAIMER */}
          <div className="mt-6 text-sm text-muted-foreground flex gap-2">
            <Info className="w-4 h-4 mt-1" />
            Transport cost and distance are approximate values used for
            academic decision-support demonstration.
          </div>

        </div>
      </section>
    </Layout>
  );
}
