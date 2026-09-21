import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CustomerPage() {
  const navigate = useNavigate();

  const sendRequest = () => {
    sessionStorage.setItem("approved", "false");
    alert("Request sent to farmer. Awaiting approval.");
  };

  return (
    <Layout>
      <section className="py-16">
        <h2 className="text-2xl font-bold mb-4">Available Farmer</h2>

        <div className="border p-4 rounded-xl">
          <p><b>Farmer:</b> Ramesh Patil</p>
          <p><b>Location:</b> Vijayapura</p>
          <p><b>Price:</b> ₹145/kg</p>

          <Button className="mt-4" onClick={sendRequest}>
            Send Purchase Request
          </Button>
        </div>
      </section>
    </Layout>
  );
}
