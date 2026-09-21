import { createContext, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import DiseaseDetection from "./pages/DiseaseDetection";
import Result from "./pages/Result";
import Marketplace from "./pages/Marketplace";
import Weather from "./pages/Weather";
import Prices from "./pages/Prices";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

/* ===============================
   LANGUAGE CONTEXT (GLOBAL)
================================ */
export const LanguageContext = createContext<{
  lang: "en" | "kn" | "hi";
  setLang: (lang: "en" | "kn" | "hi") => void;
}>({
  lang: "en",
  setLang: () => {},
});

const queryClient = new QueryClient();

const App = () => {
  const [lang, setLang] = useState<"en" | "kn" | "hi">("en");

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/disease-detection" element={<DiseaseDetection />} />
              <Route path="/result" element={<Result />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/prices" element={<Prices />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageContext.Provider>
  );
};

export default App;