import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Shield,
  PlusCircle,
  Search,
  ArrowUp,
  ArrowDown,
  MapPin,
} from "lucide-react";

/* =========================
   TYPES
========================= */
type FarmerListing = {
  farmer: string;
  village: string;
  district: string;
  quantity: number;
  price: number;
  status: "Available" | "Sold";
};

/* =========================
   COMPONENT
========================= */
export default function FarmerMarketplace() {
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState<FarmerListing[]>([
    {
      farmer: "Ramesh Patil",
      village: "Vijayapura",
      district: "Vijayapura",
      quantity: 120,
      price: 145,
      status: "Available",
    },
    {
      farmer: "Suresh Naik",
      village: "Indi",
      district: "Vijayapura",
      quantity: 90,
      price: 138,
      status: "Available",
    },
    {
      farmer: "Mahesh Kulkarni",
      village: "Sindagi",
      district: "Vijayapura",
      quantity: 60,
      price: 132,
      status: "Sold",
    },
  ]);

  /* ---------- FORM STATE ---------- */
  const [farmer, setFarmer] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  /* ---------- ADD LISTING ---------- */
  const addListing = () => {
    if (!farmer || !village || !district || !quantity || !price) return;

    setListings([
      ...listings,
      {
        farmer,
        village,
        district,
        quantity: Number(quantity),
        price: Number(price),
        status: "Available",
      },
    ]);

    setFarmer("");
    setVillage("");
    setDistrict("");
    setQuantity("");
    setPrice("");
  };

  /* ---------- FILTER ---------- */
  const filtered = listings.filter(
    (l) =>
      l.village.toLowerCase().includes(search.toLowerCase()) ||
      l.district.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- SORT ---------- */
  const highest = [...listings].sort((a, b) => b.price - a.price)[0];
  const lowest = [...listings].sort((a, b) => a.price - b.price)[0];

  /* =========================
     UI
  ========================= */
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold">
              Farmer Direct Marketplace
            </h1>
            <p className="text-muted-foreground mt-2">
              Sell directly • Fair pricing • Farmer protected
            </p>
          </div>

          {/* PROTECTION NOTICE */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-10 flex gap-4">
            <Shield className="w-8 h-8 text-primary" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p>✔ No phone numbers shown</p>
              <p>✔ No Aadhaar or OTP required</p>
              <p>✔ Farmer controls price & quantity</p>
              <p>✔ Prototype for academic & research use</p>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-2 gap-10">

            {/* ADD FARMER FORM */}
            <div className="bg-card border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-primary" />
                Add Your Produce
              </h2>

              <div className="space-y-4">
                <Input placeholder="Farmer Name" value={farmer} onChange={(e) => setFarmer(e.target.value)} />
                <Input placeholder="Village" value={village} onChange={(e) => setVillage(e.target.value)} />
                <Input placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
                <Input placeholder="Quantity (kg)" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <Input placeholder="Price per kg (₹)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

                <Button className="w-full" onClick={addListing}>
                  List My Produce
                </Button>
              </div>
            </div>

            {/* MARKET TABLE */}
            <div className="bg-card border rounded-2xl p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search village or district..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="p-3 text-left">Farmer</th>
                    <th className="p-3 text-left">Location</th>
                    <th className="p-3 text-right">Qty (kg)</th>
                    <th className="p-3 text-right">Price ₹</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-3 font-medium">{l.farmer}</td>
                      <td className="p-3 text-muted-foreground flex gap-1 items-center">
                        <MapPin className="w-4 h-4" /> {l.village}
                      </td>
                      <td className="p-3 text-right">{l.quantity}</td>
                      <td className="p-3 text-right font-semibold">₹{l.price}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            l.status === "Available"
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* HIGH / LOW */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {highest && (
              <div className="bg-primary/5 border rounded-2xl p-6">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <ArrowUp className="text-primary" /> Highest Price
                </h3>
                <p>{highest.farmer} – ₹{highest.price}</p>
              </div>
            )}

            {lowest && (
              <div className="bg-destructive/5 border rounded-2xl p-6">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <ArrowDown className="text-destructive" /> Lowest Price
                </h3>
                <p>{lowest.farmer} const variableName: : ₹{lowest.price}</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </Layout>
  );
}
