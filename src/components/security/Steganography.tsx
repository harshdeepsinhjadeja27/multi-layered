import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Upload, Download, Image as ImageIcon, Target, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Point {
  x: number;
  y: number;
}

interface SteganographyProps {
  inputData?: string;
  mode: "encrypt" | "decrypt";
  onComplete?: (data: string) => void;
}

export const Steganography = ({ inputData = "", mode, onComplete }: SteganographyProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<Point[]>([]);
  const [attempts, setAttempts] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState("");
  const [step, setStep] = useState<"upload" | "select" | "process" | "complete">("upload");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("Image file loaded, setting state");
      setImage(e.target?.result as string);
      setStep("select");
      setSelectedPoints([]);
      setAttempts(3);
      toast.success("Image loaded! Now select 4 security points.");
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log("Canvas clicked!", { step, selectedPointsLength: selectedPoints.length });
    
    if (step !== "select" || selectedPoints.length >= 4) {
      console.log("Click blocked:", { step, pointsLength: selectedPoints.length });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("No canvas ref");
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    console.log("Click coordinates:", { x, y, rect, scaleX, scaleY });

    const newPoint = { x, y };
    const newPoints = [...selectedPoints, newPoint];
    setSelectedPoints(newPoints);

    if (newPoints.length === 4) {
      toast.success("All 4 security points selected!");
      setStep("process");
    } else {
      toast.info(`Point ${newPoints.length}/4 selected`);
    }
  };

  const handleDecryptAttempt = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log("Decrypt attempt clicked!", { mode, step, selectedPointsLength: selectedPoints.length });
    
    if (mode !== "decrypt" || step !== "select") {
      console.log("Decrypt click blocked:", { mode, step });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("No canvas ref for decrypt");
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    console.log("Decrypt click coordinates:", { x, y, rect, scaleX, scaleY });

    const newPoint = { x, y };
    const newPoints = [...selectedPoints, newPoint];
    setSelectedPoints(newPoints);

    if (newPoints.length === 4) {
      // Simulate point verification
      const isCorrect = Math.random() > 0.5; // 50% chance for demo
      
      if (isCorrect) {
        toast.success("Correct sequence! Extracting hidden data...");
        processDecryption();
      } else {
        const remainingAttempts = attempts - 1;
        setAttempts(remainingAttempts);
        setSelectedPoints([]);
        
        if (remainingAttempts > 0) {
          toast.error(`Incorrect sequence! ${remainingAttempts} attempts remaining.`);
        } else {
          toast.error("Maximum attempts exceeded. Access denied!");
          setStep("complete");
        }
      }
    } else {
      toast.info(`Point ${newPoints.length}/4 selected for decryption`);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !image) {
      console.log("DrawCanvas early return:", { canvas: !!canvas, image: !!image });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log("No canvas context");
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      console.log("Image loaded, drawing canvas:", { 
        imgWidth: img.width, 
        imgHeight: img.height, 
        selectedPointsCount: selectedPoints.length 
      });
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Draw selected points
      selectedPoints.forEach((point, index) => {
        ctx.fillStyle = '#00d4ff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        // Draw point number
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText((index + 1).toString(), point.x, point.y + 4);
      });
    };
    
    img.onerror = () => {
      console.log("Failed to load image");
    };
    
    img.src = image;
  };

  useEffect(() => {
    console.log("useEffect triggered:", { image: !!image, canvas: !!canvasRef.current, selectedPointsLength: selectedPoints.length });
    if (image && canvasRef.current) {
      drawCanvas();
    }
  }, [image, selectedPoints]);

  const processEncryption = async () => {
    if (selectedPoints.length !== 4) {
      toast.error("Please select exactly 4 security points");
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate steganography process
      const stegoData = {
        data: inputData,
        points: selectedPoints,
        imageData: image,
        algorithm: "LSB-Steganography",
        timestamp: new Date().toISOString()
      };
      
      const encodedResult = btoa(JSON.stringify(stegoData));
      setResult(encodedResult);
      setStep("complete");
      onComplete?.(encodedResult);
      toast.success("Data successfully hidden in image!");
      
    } catch (error) {
      toast.error("Steganography process failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const processDecryption = async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate data extraction
      const extractedMessage = "Hidden message successfully extracted!";
      setResult(extractedMessage);
      setStep("complete");
      onComplete?.(extractedMessage);
      toast.success("Hidden data extracted successfully!");
      
    } catch (error) {
      toast.error("Data extraction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProtectedImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'protected-image.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
    toast.success("Protected image downloaded!");
  };

  const resetProcess = () => {
    setImage(null);
    setSelectedPoints([]);
    setAttempts(3);
    setResult("");
    setStep("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Image Steganography {mode === "encrypt" ? "- Hide Data" : "- Extract Data"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Process Step</span>
            <span className="capitalize">{step}</span>
          </div>
          <Progress 
            value={
              step === "upload" ? 25 : 
              step === "select" ? 50 : 
              step === "process" ? 75 : 100
            } 
            className="h-2"
          />
        </div>

        {/* Step 1: Upload Image */}
        {step === "upload" && (
          <div className="space-y-4 text-center">
            <div className="border-2 border-dashed border-border rounded-lg p-8 cyber-border">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {mode === "encrypt" ? "Upload an image to hide your data" : "Upload the protected image"}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="cyber-border"
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Image
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Point Selection */}
        {(step === "select" || step === "process") && image && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Security Points</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {selectedPoints.length}/4 Points
                </Badge>
                {mode === "decrypt" && (
                  <Badge variant={attempts > 0 ? "default" : "destructive"}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {attempts} Attempts
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="relative border border-border rounded-lg overflow-hidden cyber-border">
              <canvas
                ref={canvasRef}
                onClick={mode === "encrypt" ? handleCanvasClick : handleDecryptAttempt}
                className="max-w-full h-auto cursor-crosshair block"
                style={{ maxHeight: '400px', display: 'block' }}
              />
              {selectedPoints.length < 4 && (
                <div className="absolute top-2 left-2 bg-background/90 px-2 py-1 rounded text-xs">
                  <Target className="h-3 w-3 inline mr-1" />
                  Click to select point {selectedPoints.length + 1}/4
                </div>
              )}
            </div>

            {mode === "encrypt" && selectedPoints.length === 4 && step === "process" && (
              <Button
                onClick={processEncryption}
                disabled={isProcessing}
                className="w-full cyber-glow gradient-primary"
              >
                {isProcessing ? "Hiding Data..." : "Hide Data in Image"}
              </Button>
            )}
          </div>
        )}

        {/* Step 3: Complete */}
        {step === "complete" && (
          <div className="space-y-4">
            {mode === "encrypt" && result && (
              <div className="text-center space-y-4">
                <Badge className="bg-accent/20 text-accent">SUCCESS</Badge>
                <p className="text-foreground">Data successfully hidden in image!</p>
                <Button
                  onClick={downloadProtectedImage}
                  className="cyber-glow success-glow"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Protected Image
                </Button>
              </div>
            )}
            
            {mode === "decrypt" && result && attempts > 0 && (
              <div className="text-center space-y-4">
                <Badge className="bg-accent/20 text-accent">SUCCESS</Badge>
                <p className="text-foreground">Hidden data extracted successfully!</p>
                <div className="bg-secondary/50 border border-border rounded-lg p-4">
                  <Label className="text-xs">Extracted Data</Label>
                  <p className="font-mono text-sm mt-2">{result}</p>
                </div>
              </div>
            )}
            
            {attempts === 0 && (
              <div className="text-center space-y-4">
                <Badge variant="destructive">ACCESS DENIED</Badge>
                <p className="text-muted-foreground">Maximum attempts exceeded</p>
              </div>
            )}

            <Button
              onClick={resetProcess}
              variant="outline"
              className="w-full cyber-border"
            >
              Start New Process
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};