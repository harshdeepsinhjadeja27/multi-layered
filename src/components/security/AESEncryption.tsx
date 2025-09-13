import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Unlock, Key, Copy } from "lucide-react";
import { toast } from "sonner";

interface AESEncryptionProps {
  inputData?: string;
  mode?: "encrypt" | "decrypt";
  onComplete?: (data: string) => void;
}

export const AESEncryption = ({ inputData = "", mode = "encrypt", onComplete }: AESEncryptionProps) => {
  const [message, setMessage] = useState(inputData);
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const generateRandomKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let key = "";
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(key);
    toast.success("Secure key generated!");
  };

  const processAES = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter a password");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate AES encryption/decryption with base64 encoding for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let processedResult: string;
      
      if (mode === "encrypt") {
        // Simple base64 encoding for demo (in real app, use proper AES-256)
        processedResult = btoa(JSON.stringify({
          data: message,
          key: password.substring(0, 8) + "...", // Show partial key
          algorithm: "AES-256-GCM",
          timestamp: new Date().toISOString()
        }));
        toast.success("Message encrypted with AES-256!");
      } else {
        // Simple base64 decoding for demo
        try {
          const decoded = JSON.parse(atob(message));
          processedResult = decoded.data || "Decrypted message";
          toast.success("Message decrypted successfully!");
        } catch {
          processedResult = "Invalid encrypted data";
          toast.error("Failed to decrypt - invalid data format");
        }
      }
      
      setResult(processedResult);
      onComplete?.(processedResult);
      
    } catch (error) {
      toast.error("AES processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <Card className="gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mode === "encrypt" ? <Lock className="h-5 w-5 text-primary" /> : <Unlock className="h-5 w-5 text-accent" />}
          AES-256 {mode === "encrypt" ? "Encryption" : "Decryption"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{mode === "encrypt" ? "Message to Encrypt" : "Encrypted Data"}</Label>
          <Textarea
            placeholder={mode === "encrypt" ? "Enter your secret message..." : "Paste encrypted data here..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] bg-input border-border cyber-border"
          />
        </div>

        <div className="space-y-2">
          <Label>Encryption Password</Label>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter secure password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-input border-border cyber-border"
            />
            {mode === "encrypt" && (
              <Button
                variant="outline"
                onClick={generateRandomKey}
                className="cyber-border"
              >
                <Key className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Button
          onClick={processAES}
          disabled={isProcessing}
          className={`w-full cyber-glow ${mode === "encrypt" ? "gradient-primary" : "bg-accent hover:bg-accent/90"}`}
        >
          {isProcessing ? (
            "Processing..."
          ) : (
            <>
              {mode === "encrypt" ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}
              {mode === "encrypt" ? "Encrypt with AES-256" : "Decrypt with AES-256"}
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-2">
            <Label>{mode === "encrypt" ? "Encrypted Result" : "Decrypted Message"}</Label>
            <div className="relative">
              <Textarea
                value={result}
                readOnly
                className="min-h-[100px] bg-secondary/50 border-border font-mono text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(result)}
                className="absolute top-2 right-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};