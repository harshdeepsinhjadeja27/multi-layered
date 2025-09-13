import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Key, Image } from "lucide-react";
import { FourLayerProtection } from "@/components/security/FourLayerProtection";

const Index = () => {
  const [activeMode, setActiveMode] = useState<"overview" | "protection">("overview");

  const securityFeatures = [
    {
      icon: <Lock className="h-8 w-8" />,
      title: "AES-256 Encryption",
      description: "Military-grade symmetric encryption for maximum data protection",
      level: "LEVEL 1"
    },
    {
      icon: <Key className="h-8 w-8" />,
      title: "RSA-2048 Encryption", 
      description: "Asymmetric encryption with 2048-bit key strength",
      level: "LEVEL 2"
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Steganography",
      description: "Hide messages within images using advanced point-selection system",
      level: "LEVEL 3"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "4-Layer Protection",
      description: "Combined cryptographic pipeline for ultimate security",
      level: "LEVEL 4"
    }
  ];

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary cyber-glow" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">CyberGuard</h1>
                <p className="text-sm text-muted-foreground">Enhanced Security Tools Suite</p>
              </div>
            </div>
            <Badge variant="outline" className="border-primary/50 text-primary cyber-glow">
              SECURITY LEVEL: MAXIMUM
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {activeMode === "overview" ? (
          <>
            {/* Hero Section */}
            <section className="text-center py-12 mb-12">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-6 text-foreground">
                  Advanced Cryptographic Protection
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Professional-grade security tools combining AES-256, RSA-2048, and steganography 
                  in a seamless 4-layer protection system
                </p>
                <Button 
                  size="lg" 
                  className="cyber-glow gradient-primary"
                  onClick={() => setActiveMode("protection")}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Launch Security Suite
                </Button>
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="gradient-card border-border/50 cyber-border hover:cyber-glow transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-primary">{feature.icon}</div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </section>

            {/* Security Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="gradient-card border-border/50 text-center">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-primary">256-bit</CardTitle>
                  <CardDescription>AES Encryption Strength</CardDescription>
                </CardHeader>
              </Card>
              <Card className="gradient-card border-border/50 text-center">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-accent">2048-bit</CardTitle>
                  <CardDescription>RSA Key Length</CardDescription>
                </CardHeader>
              </Card>
              <Card className="gradient-card border-border/50 text-center">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-warning">4-Point</CardTitle>
                  <CardDescription>Steganography Security</CardDescription>
                </CardHeader>
              </Card>
            </section>
          </>
        ) : (
          <FourLayerProtection onBack={() => setActiveMode("overview")} />
        )}
      </main>
    </div>
  );
};

export default Index;