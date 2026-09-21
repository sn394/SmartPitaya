import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Scan,
  Upload,
  ImageIcon,
  Leaf,
  CheckCircle,
  AlertCircle,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Backend supports ONLY:
 * plantPart = "leaf" | "fruit"
 */
const plantParts = ["Leaf", "Fruit"];

/** Convert base64 image to File */
function dataURLToFile(dataUrl: string, filename = "plant.jpg") {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

export default function DiseaseDetection() {
  const navigate = useNavigate();

  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string>("Leaf");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      readFile(e.dataTransfer.files[0]);
    }
  }, []);

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      readFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("Please select or capture an image first.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const file = dataURLToFile(selectedImage);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("plantPart", selectedPart.toLowerCase());

      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData,
        { timeout: 60000 }
      );

      navigate("/result", {
        state: {
          image: selectedImage,
          plantPart: selectedPart,
          result: response.data,
        },
      });
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.message ||
        "Prediction failed";
      toast.error(String(msg));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Scan className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  AI-Powered Analysis
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Disease Detection
              </h1>
              <p className="text-muted-foreground text-lg">
                Upload or capture a plant image to identify diseases.
              </p>
            </div>

            {/* Upload Box */}
            <div
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-8 md:p-12 transition cursor-pointer",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
                selectedImage && "border-primary bg-primary/5"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              {/* Gallery Upload */}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />

              {/* Camera Capture */}
              <input
                id="camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileInput}
                className="hidden"
              />

              {selectedImage ? (
                <div className="text-center space-y-4">
                  <img
                    src={selectedImage}
                    alt="Plant"
                    className="mx-auto rounded-xl max-h-80 object-cover"
                  />
                  <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Image Ready
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Click or drag image here
                  </p>
                </div>
              )}
            </div>

            {/* Camera Button */}
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("camera-input")?.click()
                }
              >
                <Camera className="w-4 h-4 mr-2" />
                Open Camera
              </Button>
            </div>

            {/* Plant Part */}
            <div className="mt-8">
              <label className="block text-sm font-medium mb-3">
                Select Plant Part
              </label>
              <div className="flex gap-3">
                {plantParts.map((part) => (
                  <button
                    key={part}
                    onClick={() => setSelectedPart(part)}
                    className={cn(
                      "px-5 py-3 rounded-xl font-medium",
                      selectedPart === part
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}
                  >
                    <Leaf className="inline w-4 h-4 mr-2" />
                    {part}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <div className="mt-8">
              <Button
                onClick={handleAnalyze}
                disabled={!selectedImage || isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Image"}
              </Button>
            </div>

            {/* Tips */}
            <div className="bg-secondary/50 rounded-xl p-6 mt-8">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary" />
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use clear, well-lit images</li>
                  <li>• Focus on affected area</li>
                  <li>• Avoid blurry photos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
