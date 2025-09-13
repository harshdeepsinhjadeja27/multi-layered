import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, Lock, Key, Eye, Download, Upload } from "lucide-react";
import { AESEncryption } from "./AESEncryption";
import { RSAEncryption } from "./RSAEncryption";
import { Steganography } from "./Steganography";
import { toast } from "sonner";

interface FourLayerProtectionProps {
  onBack: () => void;
}

export const FourLayerProtection = ({ onBack }: FourLayerProtectionProps) => {
  const [activeTab, setActiveTab] = useState("encrypt");
  const [protectionData, setProtectionData] = useState({
    originalMessage: "",
    aesEncrypted: "",
    rsaEncrypted: "",
    steganographyData: "",
    finalProtectedData: ""
  });

  const protectionSteps = [
    { id: "aes", icon: <Lock className="h-5 w-5" />, title: "AES-256", status: "pending" },
    { id: "rsa", icon: <Key className="h-5 w-5" />, title: "RSA-2048", status: "pending" },
    { id: "stego", icon: <Eye className="h-5 w-5" />, title: "Steganography", status: "pending" },
    { id: "complete", icon: <Shield className="h-5 w-5" />, title: "Protected", status: "pending" }
  ];

  const handleProtectionComplete = (data: any) => {
    setProtectionData(data);
    toast.success("4-Layer protection applied successfully!");
  };

  const handleDecryptionComplete = (data: any) => {
    setProtectionData(data);
    toast.success("Message decrypted successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="cyber-border"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Overview
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">4-Layer Protection Suite</h1>
            <p className="text-muted-foreground">Advanced cryptographic pipeline system</p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary/50 text-primary cyber-glow">
          SECURE MODE ACTIVE
        </Badge>
      </div>

      {/* Protection Pipeline Status */}
      <Card className="gradient-card border-border/50 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Protection Pipeline Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {protectionSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    p-3 rounded-full border-2 transition-all
                    ${step.status === 'complete' ? 'border-accent bg-accent/20 text-accent' : 
                      step.status === 'active' ? 'border-primary bg-primary/20 text-primary cyber-glow' :
                      'border-muted bg-muted/20 text-muted-foreground'
                    }
                  `}>
                    {step.icon}
                  </div>
                  <span className="text-sm mt-2 font-medium">{step.title}</span>
                </div>
                {index < protectionSteps.length - 1 && (
                  <div className="h-px bg-border w-16 mx-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-card border-border">
          <TabsTrigger value="encrypt" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Lock className="h-4 w-4 mr-2" />
            Encrypt & Protect
          </TabsTrigger>
          <TabsTrigger value="decrypt" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
            <Eye className="h-4 w-4 mr-2" />
            Decrypt & Extract
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="space-y-6">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Sequential Protection Pipeline</CardTitle>
              <CardDescription>
                Your message will be processed through each security layer automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: AES Encryption */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary">STEP 1</Badge>
                  <h3 className="font-semibold">AES-256 Encryption</h3>
                </div>
                <AESEncryption onComplete={(data) => handleProtectionComplete({...protectionData, aesEncrypted: data})} />
              </div>

              {/* Step 2: RSA Encryption */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-secondary/20 text-secondary-foreground">STEP 2</Badge>
                  <h3 className="font-semibold">RSA-2048 Encryption</h3>
                </div>
                <RSAEncryption 
                  inputData={protectionData.aesEncrypted}
                  onComplete={(data) => handleProtectionComplete({...protectionData, rsaEncrypted: data})} 
                />
              </div>

              {/* Step 3: Steganography */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent/20 text-accent">STEP 3</Badge>
                  <h3 className="font-semibold">Image Steganography</h3>
                </div>
                <Steganography 
                  inputData={protectionData.rsaEncrypted}
                  mode="encrypt"
                  onComplete={(data) => handleProtectionComplete({...protectionData, finalProtectedData: data})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-6">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Sequential Decryption Pipeline</CardTitle>
              <CardDescription>
                Upload your protected image and follow the decryption steps in reverse order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Steganography Extraction */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent/20 text-accent">STEP 1</Badge>
                  <h3 className="font-semibold">Extract from Image</h3>
                </div>
                <Steganography 
                  mode="decrypt"
                  onComplete={(data) => handleDecryptionComplete({...protectionData, steganographyData: data})} 
                />
              </div>

              {/* Step 2: RSA Decryption */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-secondary/20 text-secondary-foreground">STEP 2</Badge>
                  <h3 className="font-semibold">RSA-2048 Decryption</h3>
                </div>
                <RSAEncryption 
                  inputData={protectionData.steganographyData}
                  mode="decrypt"
                  onComplete={(data) => handleDecryptionComplete({...protectionData, rsaEncrypted: data})} 
                />
              </div>

              {/* Step 3: AES Decryption */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary">STEP 3</Badge>
                  <h3 className="font-semibold">AES-256 Decryption</h3>
                </div>
                <AESEncryption 
                  inputData={protectionData.rsaEncrypted}
                  mode="decrypt"
                  onComplete={(data) => handleDecryptionComplete({...protectionData, originalMessage: data})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};