import { useState, useRef, useEffect } from "react";
import { X, Terminal, Star, Search, Info, FileText, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "@tauri-apps/plugin-shell";
import { openPath } from "@tauri-apps/plugin-opener";
import { unregister, register } from "@tauri-apps/plugin-global-shortcut";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Credits } from "@/components/credits";

interface CommandItem {
  id: string;
  name: string;
  command: string;
  type: "script" | "file" | "command";
  isFavorite: boolean;
  lastUsed?: Date;
  description?: string;
}

interface CommandLauncherProps {
  onToast: (message: string, type: "success" | "error" | "info") => void;
}

export function CommandLauncher({ onToast }: CommandLauncherProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCredits, setShowCredits] = useState(false);
  const [commands, setCommands] = useState<CommandItem[]>([
    {
      id: "1",
      name: "Open Terminal",
      command: "open -a Terminal",
      type: "command",
      isFavorite: true,
      description: "Launch Terminal application",
    },
    {
      id: "2",
      name: "Open VS Code",
      command: "code .",
      type: "command",
      isFavorite: true,
      description: "Open current directory in VS Code",
    },
    {
      id: "3",
      name: "Git Status",
      command: "git status",
      type: "script",
      isFavorite: false,
      description: "Check git repository status",
    },
    {
      id: "4",
      name: "Open Finder",
      command: "open .",
      type: "file",
      isFavorite: true,
      description: "Open current directory in Finder",
    },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<CommandItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const favoriteCommands = commands.filter((cmd) => cmd.isFavorite);

  const executeCommand = async (commandItem: CommandItem) => {
    try {
      if (commandItem.type === "file") {
        await openPath(commandItem.command);
      } else {
        const command = Command.create("execute-command", [
          "sh",
          "-c",
          commandItem.command,
        ]);
        await command.execute();
      }

      const updatedCommand = {
        ...commandItem,
        lastUsed: new Date(),
      };

      setCommands((prev) =>
        prev.map((cmd) => (cmd.id === commandItem.id ? updatedCommand : cmd)),
      );

      setRecentCommands((prev) => {
        const filtered = prev.filter((cmd) => cmd.id !== commandItem.id);
        return [updatedCommand, ...filtered].slice(0, 5);
      });

      onToast(`Executed: ${commandItem.name}`, "success");
      setSearchQuery("");
      setSelectedIndex(0);
    } catch (error) {
      onToast(`Failed to execute: ${commandItem.name}`, "error");
      console.error("Command execution failed:", error);
    }
  };

  const toggleFavorite = (commandId: string) => {
    setCommands((prev) =>
      prev.map((cmd) =>
        cmd.id === commandId ? { ...cmd, isFavorite: !cmd.isFavorite } : cmd,
      ),
    );
  };

  const getCommandIcon = (type: CommandItem["type"]) => {
    switch (type) {
      case "script":
        return <Terminal className="w-4 h-4" />;
      case "file":
        return <FileText className="w-4 h-4" />;
      default:
        return <Terminal className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const setupGlobalShortcut = async () => {
      try {
        await register("CommandOrControl+Space", async () => {
          await invoke("toggle_window");
        });
      } catch (error) {
        console.error("Failed to register global shortcut:", error);
      }
    };

    void setupGlobalShortcut();

    return () => {
      unregister("CommandOrControl+Space").catch(console.error);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            void executeCommand(filteredCommands[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          void invoke("toggle_window");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredCommands, selectedIndex, executeCommand]);

  return (
    <div className="h-full bg-background/95 backdrop-blur-sm">
      {showCredits && <Credits onClose={() => setShowCredits(false)} />}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full"
      >
        <Card className="h-full overflow-hidden border-0 bg-transparent shadow-none">
          <div className="p-4 h-full flex flex-col">
            {/* Arrow pointing up to tray icon */}
            <div className="flex justify-center mb-2">
              <div className="w-3 h-3 bg-background border border-border rotate-45 transform -translate-y-1.5"></div>
            </div>

            <div className="bg-background/95 backdrop-blur-sm rounded-lg border border-border/50 shadow-lg flex-1 flex flex-col">
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      ref={inputRef}
                      placeholder="Search commands..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedIndex(0);
                      }}
                      className="pl-10 pr-4 py-2 border-0 bg-muted/30 focus:bg-muted/50 transition-colors"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCredits(true)}
                      className="text-muted-foreground hover:text-foreground p-1.5"
                      title="About QuickCMD"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => invoke("show_window")}
                      className="text-muted-foreground hover:text-foreground p-1.5"
                      title="Force Show Window"
                    >
                      Show
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => invoke("toggle_window")}
                      className="text-muted-foreground hover:text-foreground p-1.5"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {searchQuery === "" && (
                  <div className="p-4 space-y-4 h-full overflow-y-auto">
                    {favoriteCommands.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Favorites
                          </span>
                        </div>
                        <div className="space-y-1">
                          {favoriteCommands.slice(0, 4).map((cmd) => (
                            <motion.div
                              key={cmd.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <Button
                                variant="ghost"
                                className="w-full justify-start p-3 h-auto bg-muted/20 hover:bg-muted/40"
                                onClick={() => executeCommand(cmd)}
                              >
                                <div className="flex items-center gap-3 w-full">
                                  {getCommandIcon(cmd.type)}
                                  <div className="text-left flex-1">
                                    <div className="font-medium text-sm">
                                      {cmd.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {cmd.description}
                                    </div>
                                  </div>
                                </div>
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {recentCommands.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Recent
                          </span>
                        </div>
                        <div className="space-y-1">
                          {recentCommands.slice(0, 3).map((cmd) => (
                            <Button
                              key={cmd.id}
                              variant="ghost"
                              className="w-full justify-start p-3 h-auto bg-muted/20 hover:bg-muted/40"
                              onClick={() => executeCommand(cmd)}
                            >
                              <div className="flex items-center gap-3 w-full">
                                {getCommandIcon(cmd.type)}
                                <div className="flex-1 text-left">
                                  <div className="font-medium text-sm">
                                    {cmd.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {cmd.command}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {searchQuery !== "" && (
                  <div className="p-4 h-full overflow-y-auto">
                    <div className="space-y-1">
                      <AnimatePresence>
                        {filteredCommands.map((cmd, index) => (
                          <motion.div
                            key={cmd.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Button
                              variant={
                                index === selectedIndex ? "secondary" : "ghost"
                              }
                              className="w-full justify-start p-3 h-auto bg-muted/20 hover:bg-muted/40"
                              onClick={() => executeCommand(cmd)}
                            >
                              <div className="flex items-center gap-3 w-full">
                                {getCommandIcon(cmd.type)}
                                <div className="flex-1 text-left">
                                  <div className="font-medium text-sm">
                                    {cmd.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {cmd.command}
                                  </div>
                                  {cmd.description && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {cmd.description}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {cmd.type}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(cmd.id);
                                    }}
                                    className="p-1 h-auto"
                                  >
                                    <Star
                                      className={`w-3 h-3 ${
                                        cmd.isFavorite
                                          ? "fill-yellow-500 text-yellow-500"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  </Button>
                                </div>
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {filteredCommands.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          No commands found for "{searchQuery}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
