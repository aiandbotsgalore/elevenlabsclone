import { useState } from "react";
import { Copy, MoreHorizontal, Check } from "lucide-react";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import Sidebar from "./components/Sidebar";
import AgentTab from "./components/AgentTab";
import VoiceTab from "./components/VoiceTab";
import TestAgentDialog from "./components/TestAgentDialog";

export default function App() {
  const [activeTab, setActiveTab] = useState("agent");
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    // In a real app, this would get the actual URL
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="flex w-full flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <div className="text-sm">Agents</div>
              <div className="mx-1 text-muted-foreground">/</div>
              <div className="text-sm">feef</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 bg-black"
                onClick={() => setTestDialogOpen(true)}
              >
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Test AI agent
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied!" : "Copy link"}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Agent Info */}
          <div className="border-b border-border p-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-medium">feef</h2>
              <span className="ml-2 rounded bg-secondary px-2 py-1 text-xs">Public</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">KISJLMQ6773JGHFHPDO7</div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <Tabs
              defaultValue="agent"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mx-4"
            >
              <TabsList className="h-12 w-full justify-start gap-4 bg-transparent px-0">
                <TabsTrigger
                  value="agent"
                  className={`border-b-2 rounded-none ${
                    activeTab === "agent"
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  } px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none`}
                >
                  Agent
                </TabsTrigger>
                <TabsTrigger
                  value="voice"
                  className={`border-b-2 rounded-none ${
                    activeTab === "voice"
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  } px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none`}
                >
                  Voice
                </TabsTrigger>
                <TabsTrigger
                  value="analysis"
                  className={`border-b-2 rounded-none ${
                    activeTab === "analysis"
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  } px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none`}
                >
                  Analysis
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className={`border-b-2 rounded-none ${
                    activeTab === "security"
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  } px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none`}
                >
                  Security
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className={`border-b-2 rounded-none ${
                    activeTab === "advanced"
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  } px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none`}
                >
                  Advanced
                </TabsTrigger>
                <TabsTrigger
                  value="widget"
                  className={`border-b-2 rounded-none ${
                    activeTab === "widget"
                      ? "border-primary"
                      : "border-transparent hover:border-border"
                  } px-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none`}
                >
                  Widget
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === "agent" && <AgentTab />}
            {activeTab === "voice" && <VoiceTab />}
          </div>
        </div>
      </main>

      {/* Test Agent Dialog */}
      <TestAgentDialog
        open={testDialogOpen}
        onOpenChange={setTestDialogOpen}
      />
    </div>
  );
}
