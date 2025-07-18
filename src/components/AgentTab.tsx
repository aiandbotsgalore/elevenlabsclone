import { ChevronDown, Info, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import FormSection from "./FormSection";

export default function AgentTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* Agent Language */}
      <FormSection
        title="Agent Language"
        description="Choose the default language the agent will communicate in."
      >
        <div className="flex w-full">
          <div className="w-[200px]">
            <Select defaultValue="english">
              <SelectTrigger className="bg-secondary">
                <SelectValue placeholder="English" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 overflow-hidden rounded-full">
                      🇺🇸
                    </span>
                    English
                  </div>
                </SelectItem>
                <SelectItem value="spanish">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 overflow-hidden rounded-full">
                      🇪🇸
                    </span>
                    Spanish
                  </div>
                </SelectItem>
                <SelectItem value="french">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 overflow-hidden rounded-full">
                      🇫🇷
                    </span>
                    French
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      {/* Additional Languages */}
      <FormSection
        title="Additional Languages"
        description="Specify additional languages which callers can choose from."
      >
        <div className="flex w-full">
          <div className="w-full">
            <Select>
              <SelectTrigger className="bg-secondary">
                <SelectValue placeholder="Add additional languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="italian">Italian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      {/* First message */}
      <FormSection
        title="First message"
        description="The first message the agent will say. If empty, the agent will wait for the user to start the conversation."
      >
        <div className="space-y-4 w-full">
          <Textarea
            className="min-h-[80px] bg-secondary"
            placeholder="e.g. Hello, how can I help you today?"
          />
          <Button size="sm" variant="outline" className="text-xs flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Variable
          </Button>
        </div>
      </FormSection>

      {/* System prompt */}
      <FormSection
        title="System prompt"
        description="Special context instruction is used to determine the persona of the agent and the context of the conversation."
        rightElement={(
          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
            Learn more
          </Button>
        )}
      >
        <div className="space-y-4 w-full">
          <Textarea
            className="min-h-[120px] bg-secondary"
            placeholder="e.g. You are a German language teacher named Laura."
          />
          <Button size="sm" variant="outline" className="text-xs flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Variable
          </Button>
        </div>
      </FormSection>

      {/* Dynamic Variables */}
      <FormSection
        title="Dynamic Variables"
        description="Variables in the form {{VARIABLE}} in the prompt and first message will be replaced with actual values when the conversation starts."
        rightElement={(
          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
            Learn more
          </Button>
        )}
      >
        <div className="w-full" />
      </FormSection>

      {/* LLM */}
      <FormSection
        title="LLM"
        description="Select which provider and model to use for the LLM. If your chosen LLM is not available at the moment or unavailable due to a technical issue, you may be upgraded to another LLM."
      >
        <div className="w-full">
          <Select defaultValue="gpt4">
            <SelectTrigger className="bg-secondary">
              <SelectValue placeholder="GPT-4.1" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt4">GPT-4.1</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-4 text-xs text-muted-foreground">
            Currently, the LLM cost is covered by us. In the future, this cost will be passed onto you.
          </p>
        </div>
      </FormSection>

      {/* Temperature */}
      <FormSection
        title="Temperature"
        description="Temperature is a parameter that controls the creativity or randomness of the responses generated by the LLM."
      >
        <div className="w-full">
          <div className="h-16 bg-secondary rounded-md flex items-center px-4">
            <div className="w-full h-2 bg-accent rounded-full">
              <div className="w-1/3 h-2 bg-primary rounded-full relative">
                <div className="absolute -right-2 -top-2.5 h-5 w-5 rounded-full border-2 border-primary bg-background" />
              </div>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Limit token usage */}
      <FormSection
        title="Limit token usage"
        description="Can change the maximum number of history that the LLM can predict. A limit of 0 is applied if the value is greater than 0."
      >
        <div className="w-[100px]">
          <Input type="number" className="bg-secondary" defaultValue="-1" />
        </div>
      </FormSection>

      {/* Knowledge base */}
      <FormSection
        title="Knowledge base"
        description="Provide the LLM with domain-specific information to help it answer questions more accurately."
        rightElement={(
          <Button variant="outline" size="sm" className="h-8 text-xs font-normal">
            Add document
          </Button>
        )}
      >
        <div className="w-full h-24 flex items-center justify-center border border-dashed rounded-md text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <span className="rounded-full bg-secondary p-2">
              <Info className="h-4 w-4" />
            </span>
            <span>transcript of current discussion</span>
          </div>
        </div>
      </FormSection>

      {/* Use RAG */}
      <FormSection
        title="Use RAG"
        description="Retrieval Augmented Generation (RAG) increases the agent's maximum Knowledge Base size. The agent will have access to relevant pieces of prepared Knowledge Base during answer generation."
      >
        <div className="flex items-center gap-4">
          <Switch />
          <span className="text-sm text-muted-foreground">Disabled</span>
        </div>
      </FormSection>

      {/* Tools */}
      <FormSection
        title="Tools"
        description="Provide the agent with tools it can use to help users."
        rightElement={(
          <Button variant="outline" size="sm" className="h-8 text-xs font-normal">
            Add tool
          </Button>
        )}
      >
        <div className="w-full rounded-md border">
          <div className="flex items-center p-4 gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-accent">
              <span>🌐</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium flex items-center">web.call <span className="text-xs ml-2 px-1.5 py-0.5 rounded-sm bg-accent text-muted-foreground">System</span></h4>
              <p className="text-xs text-muted-foreground">Gives agent the ability to end the call with the user.</p>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </FormSection>

      {/* Workspace Secrets */}
      <FormSection
        title="Workspace Secrets"
        description="Create and manage secure secrets that can be accessed across your workspace."
        rightElement={(
          <Button variant="outline" size="sm" className="h-8 text-xs font-normal">
            Add secret
          </Button>
        )}
      >
        <div className="w-full h-20 flex items-center justify-center border border-dashed rounded-md text-sm text-muted-foreground">
          No workspace secrets
        </div>
      </FormSection>
    </div>
  );
}
