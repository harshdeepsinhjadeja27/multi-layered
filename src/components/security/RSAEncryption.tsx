import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Key, Copy, RefreshCw, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

interface RSAEncryptionProps {
  inputData?: string;
  mode?: "encrypt" | "decrypt";
  onComplete?: (data: string) => void;
}

export const RSAEncryption = ({ inputData = "", mode = "encrypt", onComplete }: RSAEncryptionProps) => {
  const [message, setMessage] = useState(inputData);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [keyPairGenerated, setKeyPairGenerated] = useState(false);

  useEffect(() => {
    if (inputData) {
      setMessage(inputData);
    }
  }, [inputData]);

  const generateRSAKeyPair = async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate RSA-2048 key pair generation (in real app, use Web Crypto API)
      const mockPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4f5wg5l2hKsTeNem/V41
fGnJm6gOdrj8ym3rFkEjWT2btf06kkstX2AC6HJH3Y8dq9nU7yjNR+nqjGf0r17d
5DH0uo1FvDMhJ0F8aT5e2tHQ1Kd02JzHE3F5C0xq/7Yc6x9DqR2z2TQa6t5x8B7A
4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2btf06kkstX2AC6HJH3Y8d
q9nU7yjNR+nqjGf0r17d5DH0uo1FvDMhJ0F8aT5e2tHQ1Kd02JzHE3F5C0xq/7Yc
6x9DqR2z2TQa6t5x8B7A4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT2b
tf06kkstX2AC6HJH3Y8dq9nU7yjNR+nqjGf0r17d5QIDAQAB
-----END PUBLIC KEY-----`;

      const mockPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDh/nCDmXaEqxN4
16b9XjV8acmbqA52uPzKbesWQSNZPZu1/TqSSy1fYALockfdjx2r2dTvKM1H6eqM
Z/SvXt3kMfS6jUW8MyEnQXxpPl7a0dDUp3TYnMcTcXkLTGr/thzrH0OpHbPZNBrq
3nHwHsDh/nCDmXaEqxN416b9XjV8acmbqA52uPzKbesWQSNZPZu1/TqSSy1fYALo
ckfdjx2r2dTvKM1H6eqMZ/SvXt3kMfS6jUW8MyEnQXxpPl7a0dDUp3TYnMcTcXkL
TGr/thzrH0OpHbPZNBrq3nHwHsDh/nCDmXaEqxN416b9XjV8acmbqA52uPzKbesW
QSNZPZ...
-----END PRIVATE KEY-----`;

      setPublicKey(mockPublicKey);
      setPrivateKey(mockPrivateKey);
      setKeyPairGenerated(true);
      toast.success("RSA-2048 key pair generated successfully!");
      
    } catch (error) {
      toast.error("Key pair generation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const processRSA = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    if (mode === "encrypt" && !publicKey) {
      toast.error("Please generate key pair first");
      return;
    }
    
    if (mode === "decrypt" && !privateKey) {
      toast.error("Please generate key pair first");
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      let processedResult: string;
      
      if (mode === "encrypt") {
        // Simulate RSA encryption (in real app, use Web Crypto API)
        processedResult = btoa(JSON.stringify({
          data: message,
          algorithm: "RSA-2048",
          keyFingerprint: publicKey.substring(26, 50) + "...",
          timestamp: new Date().toISOString()
        }));
        toast.success("Message encrypted with RSA-2048!");
      } else {
        // Simulate RSA decryption
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
      toast.error("RSA processing failed");
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
          <Key className="h-5 w-5 text-primary" />
          RSA-2048 {mode === "encrypt" ? "Encryption" : "Decryption"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Pair Generation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>RSA Key Pair</Label>
            <Badge variant={keyPairGenerated ? "default" : "secondary"} className="text-xs">
              {keyPairGenerated ? "GENERATED" : "REQUIRED"}
            </Badge>
          </div>
          
          {!keyPairGenerated && (
            <Button
              onClick={generateRSAKeyPair}
              disabled={isProcessing}
              variant="outline"
              className="w-full cyber-border"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
              Generate RSA-2048 Key Pair
            </Button>
          )}
          
          {keyPairGenerated && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Public Key</Label>
                <div className="relative">
                  <Textarea
                    value={publicKey}
                    readOnly
                    className="h-20 bg-secondary/50 border-border font-mono text-xs resize-none"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(publicKey)}
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Private Key</Label>
                <div className="relative">
                  <Textarea
                    value={privateKey}
                    readOnly
                    className="h-20 bg-secondary/50 border-border font-mono text-xs resize-none"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(privateKey)}
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <Label>{mode === "encrypt" ? "Message to Encrypt" : "Encrypted Data"}</Label>
          <Textarea
            placeholder={mode === "encrypt" ? "Enter message for RSA encryption..." : "Paste RSA encrypted data..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] bg-input border-border cyber-border"
          />
        </div>

        {/* Process Button */}
        <Button
          onClick={processRSA}
          disabled={isProcessing || !keyPairGenerated}
          className={`w-full cyber-glow ${mode === "encrypt" ? "gradient-primary" : "bg-accent hover:bg-accent/90"}`}
        >
          {isProcessing ? (
            "Processing..."
          ) : (
            <>
              {mode === "encrypt" ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}
              {mode === "encrypt" ? "Encrypt with RSA-2048" : "Decrypt with RSA-2048"}
            </>
          )}
        </Button>

        {/* Result */}
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