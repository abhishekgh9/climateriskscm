import { useState, useCallback } from "react";
import { Upload, CheckCircle2, Info } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const requiredFields = [
  "Supplier Name",
  "Country",
  "Latitude",
  "Longitude",
  "Annual Spend",
  "Dependency %",
];

export default function UploadData() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped?.name.endsWith(".csv")) setFile(dropped);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.name.endsWith(".csv")) setFile(selected);
  };

  const handleUpload = () => {
    toast.success("File uploaded successfully! Analyzing supplier data...");
    setTimeout(() => navigate("/risk-analysis"), 1500);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Upload Supplier Data</h1>
          <p className="mt-1 text-muted-foreground">
            Upload a CSV file with supplier information to calculate flood risk exposure
          </p>
        </div>

        {/* Required Format */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Required CSV Format</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Your CSV file must include the following columns:
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {requiredFields.map((field) => (
              <div key={field} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm text-foreground">{field} (required)</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Revenue Impact per Day (optional)</span>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-accent p-3">
            <p className="text-xs font-medium text-muted-foreground">Example CSV format:</p>
            <code className="mt-1 block text-xs text-foreground">
              Supplier Name,Country,Latitude,Longitude,Annual Spend,Dependency,Revenue Impact per Day
              <br />
              TechCore Manufacturing,India,19.076,72.8777,15000000,40,5000000
            </code>
          </div>
        </div>

        {/* Upload Area */}
        <div className="rounded-xl border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Upload File</h2>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            {file ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
                <p className="mt-2 font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <Button onClick={handleUpload} className="mt-4">
                  Process File
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm text-foreground">
                  <label className="cursor-pointer font-medium text-primary hover:underline">
                    Click to upload
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                  </label>{" "}
                  or drag and drop
                </p>
                <p className="mt-1 text-xs text-muted-foreground">CSV files only (max 10MB)</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            The system will automatically fetch flood hazard data, calculate intensity-weighted
            probabilities, and compute Expected Annual Loss (EAL) for each supplier.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
