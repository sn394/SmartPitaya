import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function FarmerPage() {
  const navigate = useNavigate();

  const approve = () => {
    sessionStorage.setItem("approved", "true");
    navigate("/contact");
  };

  return (
    <Layout>
      <section className="py-16">
        <h2 className="text-2xl font-bold mb-4">Purchase Request</h2>

        <div className="border p-4 rounded-xl">
          <p><b>Customer:</b> Amit</p>
          <p><b>Quantity:</b> 20 kg</p>

          <div className="flex gap-4 mt-4">
            <Button onClick={approve}>Approve</Button>
            <Button variant="destructive">Reject</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
