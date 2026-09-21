import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  User,
  Tractor,
  ShieldCheck,
  MessageCircle,
  Phone,
  Check,
  X,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

/* =========================
   TYPES
========================= */
type Role = "NONE" | "CUSTOMER" | "FARMER";
type Status = "PENDING" | "APPROVED" | "REJECTED";

type PurchaseRequest = {
  id: string;

  // Customer
  customerName: string;
  customerPhone: string;

  // Order
  quantity: number;

  // Status
  status: Status;
  requestedAt: string;

  // Farmer decision
  approvedBy?: string;
  farmerPhone?: string;
  decidedAt?: string;
};

/* =========================
   CONSTANTS
========================= */
const FARMER_PROFILE = {
  name: "Ramesh Patil",
  phone: "9876543210",
};

const STORAGE_KEY = "dragonfruit_requests";

/* =========================
   HELPERS
========================= */
const isValidPhone = (p: string) => /^\d{10}$/.test(p);
const now = () => new Date().toLocaleString();

/* =========================
   COMPONENT
========================= */
export default function Contact() {
  /* ---------- ROLE ---------- */
  const [role, setRole] = useState<Role>("NONE");

  /* ---------- LOGIN ---------- */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  /* ---------- REQUESTS ---------- */
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);

  /* ---------- CUSTOMER ---------- */
  const [quantity, setQuantity] = useState("");

  /* =========================
     LOAD FROM STORAGE
  ========================== */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRequests(JSON.parse(stored));
    }
  }, []);

  /* =========================
     SAVE TO STORAGE
  ========================== */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  /* =========================
     LOGIN
  ========================== */
  const handleLogin = (r: Role) => {
    if (!name) return;

    if (!isValidPhone(phone)) {
      setPhoneError("Invalid phone number (10 digits required)");
      return;
    }

    setPhoneError("");
    setRole(r);
  };

  /* =========================
     CUSTOMER: SUBMIT REQUEST
  ========================== */
  const submitRequest = () => {
    if (!quantity || Number(quantity) <= 0) return;

    const newReq: PurchaseRequest = {
      id: Date.now().toString(),
      customerName: name,
      customerPhone: phone,
      quantity: Number(quantity),
      status: "PENDING",
      requestedAt: now(),
    };

    setRequests((prev) => [...prev, newReq]);
    setQuantity("");
  };

  /* =========================
     FARMER: APPROVE / REJECT
  ========================== */
  const approveRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "APPROVED",
              approvedBy: FARMER_PROFILE.name,
              farmerPhone: FARMER_PROFILE.phone,
              decidedAt: now(),
            }
          : r
      )
    );
  };

  const rejectRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "REJECTED",
              approvedBy: FARMER_PROFILE.name,
              decidedAt: now(),
            }
          : r
      )
    );
  };

  /* =========================
     CUSTOMER VIEW (OWN REQUEST)
  ========================== */
  const myRequest = requests.find(
    (r) => r.customerPhone === phone
  );

  /* =========================
     UI
  ========================== */
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4">

          <h1 className="text-3xl font-bold text-center mb-4">
            Farmer–Customer Approval & Communication System
          </h1>

          <div className="bg-primary/10 border rounded-xl p-4 mb-8 flex gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <p className="text-sm">
              Approved requests show farmer details and enable direct contact.
            </p>
          </div>

          {/* ================= LOGIN ================= */}
          {role === "NONE" && (
            <div className="bg-card border rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-bold">Login</h2>

              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                placeholder="Phone Number (10 digits)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {phoneError && (
                <div className="flex gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {phoneError}
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={() => handleLogin("CUSTOMER")}>
                  <User className="w-4 h-4 mr-2" />
                  Customer
                </Button>
                <Button variant="outline" onClick={() => handleLogin("FARMER")}>
                  <Tractor className="w-4 h-4 mr-2" />
                  Farmer
                </Button>
              </div>
            </div>
          )}

          {/* ================= CUSTOMER ================= */}
          {role === "CUSTOMER" && (
            <div className="bg-card border rounded-xl p-6 mt-6 space-y-4">
              <h2 className="text-xl font-bold">Customer Panel</h2>

              {!myRequest && (
                <>
                  <Input
                    type="number"
                    placeholder="Required Quantity (kg)"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <Button className="w-full" onClick={submitRequest}>
                    Submit Purchase Request
                  </Button>
                </>
              )}

              {myRequest && (
                <div className="border rounded-xl p-4 space-y-2">
                  <p><b>Applied By:</b> {myRequest.customerName}</p>
                  <p><b>Quantity:</b> {myRequest.quantity} kg</p>
                  <p><b>Status:</b> {myRequest.status}</p>
                  <p><b>Requested At:</b> {myRequest.requestedAt}</p>

                  {myRequest.status === "APPROVED" && (
                    <>
                      <hr />
                      <p className="font-semibold text-green-700">
                        Approved By: {myRequest.approvedBy}
                      </p>
                      <p><b>Approved At:</b> {myRequest.decidedAt}</p>

                      <Button
                        className="w-full"
                        onClick={() =>
                          window.open(
                            `https://wa.me/91${myRequest.farmerPhone}?text=${encodeURIComponent(
                              `Hello ${myRequest.approvedBy}, thank you for approving my request for ${myRequest.quantity} kg.`
                            )}`,
                            "_blank"
                          )
                        }
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Farmer on WhatsApp
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          window.open(`tel:+91${myRequest.farmerPhone}`)
                        }
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Farmer
                      </Button>
                    </>
                  )}

                  {myRequest.status === "REJECTED" && (
                    <p className="text-red-600 font-medium">
                      Request rejected by farmer.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= FARMER ================= */}
          {role === "FARMER" && (
            <div className="bg-card border rounded-xl p-6 mt-6 space-y-4">
              <h2 className="text-xl font-bold">Farmer Panel</h2>

              {requests.length === 0 && (
                <p className="text-muted-foreground">
                  No customer requests yet.
                </p>
              )}

              {requests.map((r) => (
                <div key={r.id} className="border rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <ClipboardList className="w-4 h-4" />
                    Customer Request
                  </div>

                  <p><b>Name:</b> {r.customerName}</p>
                  <p><b>Phone:</b> {r.customerPhone}</p>
                  <p><b>Quantity:</b> {r.quantity} kg</p>
                  <p><b>Status:</b> {r.status}</p>

                  {r.status === "PENDING" && (
                    <div className="flex gap-3 mt-2">
                      <Button onClick={() => approveRequest(r.id)}>
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => rejectRequest(r.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}
