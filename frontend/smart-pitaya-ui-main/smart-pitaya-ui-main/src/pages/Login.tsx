import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

export default function Login() {
  const navigate = useNavigate();

  const login = (role: "customer" | "farmer") => {
    sessionStorage.setItem("role", role);
    navigate(role === "customer" ? "/customer" : "/farmer");
  };

  return (
    <Layout>
      <section className="py-20 text-center">
        <h1 className="text-3xl font-bold mb-6">SmartPitaya Access</h1>
        <div className="flex justify-center gap-6">
          <Button onClick={() => login("customer")}>Customer</Button>
          <Button variant="outline" onClick={() => login("farmer")}>
            Farmer
          </Button>
        </div>
      </section>
    </Layout>
  );
}
