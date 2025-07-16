import { RefreshCw, Play, Pause, Clock, ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/libs/utils";

export interface RefreshInterval {
  label: string;
  value: number; // milliseconds, 0 = disabled
  shortLabel: string;
}

export const REFRESH_INTERVALS: RefreshInterval[] = [
  { label: "Disabled", value: 0, shortLabel: "Off" },
  { label: "Every 5 seconds", value: 5000, shortLabel: "5s" },
  { label: "Every 10 seconds", value: 10000, shortLabel: "10s" },
  { label: "Every 30 seconds", value: 30000, shortLabel: "30s" },
  { label: "Every 1 minute", value: 60000, shortLabel: "1m" },
  { label: "Every 5 minutes", value: 300000, shortLabel: "5m" },
  { label: "Every 10 minutes", value: 600000, shortLabel: "10m" },
];

interface RefreshControlsProps {
  /**
   * Function to call when manual refresh is triggered
   */
  onRefresh: () => Promise<void> | void;

  /**
   * Current auto-refresh interval in milliseconds (0 = disabled)
   */
  autoRefreshInterval: number;

  /**
   * Callback when auto-refresh interval changes
   */
  onAutoRefreshChange: (interval: number) => void;

  /**
   * Whether a refresh is currently in progress
   */
  isRefreshing?: boolean;

  /**
   * Custom className for styling
   */
  className?: string;

  /**
   * Show compact version (smaller buttons)
   */
  compact?: boolean;

  /**
   * Last refresh timestamp
   */
  lastRefresh?: Date;
}

/**
 * Reusable refresh controls component with manual and auto-refresh functionality
 */
export const RefreshControls: React.FC<RefreshControlsProps> = ({
  onRefresh,
  autoRefreshInterval,
  onAutoRefreshChange,
  isRefreshing = false,
  className,
  compact = false,
  lastRefresh,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const currentInterval =
    REFRESH_INTERVALS.find((i) => i.value === autoRefreshInterval) ||
    REFRESH_INTERVALS[0];
  const isAutoRefreshEnabled = autoRefreshInterval > 0 && !isPaused;

  // Handle auto-refresh
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    if (isAutoRefreshEnabled) {
      setCountdown(autoRefreshInterval / 1000);

      // Start countdown
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return autoRefreshInterval / 1000;
          }
          return prev - 1;
        });
      }, 1000);

      // Start auto-refresh
      intervalRef.current = setInterval(() => {
        if (!isRefreshing) {
          onRefresh();
        }
      }, autoRefreshInterval);
    } else {
      setCountdown(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [autoRefreshInterval, isPaused, isRefreshing, onRefresh]);

  const handleManualRefresh = async () => {
    if (isRefreshing) return;

    // Reset countdown if auto-refresh is enabled
    if (isAutoRefreshEnabled) {
      setCountdown(autoRefreshInterval / 1000);
    }

    await onRefresh();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatLastRefresh = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffSeconds < 60) {
      return `${diffSeconds}s ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else {
      return date.toLocaleTimeString();
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {/* Manual Refresh Button */}
      <Button
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={handleManualRefresh}
        disabled={isRefreshing}
        className={cn("relative", compact ? "h-8 px-2" : "h-9 px-3")}
      >
        <RefreshCw
          className={cn(
            compact ? "h-3 w-3" : "h-4 w-4",
            isRefreshing && "animate-spin",
          )}
        />
        {!compact && (
          <span className="ml-2">
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </span>
        )}
      </Button>

      {/* Auto-refresh Controls */}
      <div className="flex items-center space-x-1">
        {/* Auto-refresh Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={compact ? "sm" : "default"}
              className={cn(
                "relative",
                compact ? "h-8 px-2" : "h-9 px-3",
                isAutoRefreshEnabled &&
                  "border-blue-500 bg-blue-50 dark:bg-blue-950",
              )}
            >
              <Clock className={cn(compact ? "h-3 w-3" : "h-4 w-4")} />
              {!compact && <span className="ml-2">Auto</span>}
              <ChevronDown
                className={cn(compact ? "h-3 w-3 ml-1" : "h-4 w-4 ml-2")}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {REFRESH_INTERVALS.map((interval) => (
              <DropdownMenuItem
                key={interval.value}
                onClick={() => onAutoRefreshChange(interval.value)}
                className={cn(
                  "flex items-center justify-between",
                  interval.value === autoRefreshInterval && "bg-accent",
                )}
              >
                <span>{interval.label}</span>
                {interval.value === autoRefreshInterval && (
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Pause/Resume Button (only shown when auto-refresh is enabled) */}
        {autoRefreshInterval > 0 && (
          <Button
            variant="ghost"
            size={compact ? "sm" : "default"}
            onClick={togglePause}
            className={cn(compact ? "h-8 w-8 p-0" : "h-9 w-9 p-0")}
          >
            {isPaused ? (
              <Play className={cn(compact ? "h-3 w-3" : "h-4 w-4")} />
            ) : (
              <Pause className={cn(compact ? "h-3 w-3" : "h-4 w-4")} />
            )}
          </Button>
        )}
      </div>

      {/* Status Indicators */}
      {!compact && (
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {/* Auto-refresh status */}
          {isAutoRefreshEnabled && (
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className="text-xs">
                {currentInterval.shortLabel}
              </Badge>
              {countdown > 0 && (
                <span className="tabular-nums">{countdown}s</span>
              )}
            </div>
          )}

          {/* Paused indicator */}
          {autoRefreshInterval > 0 && isPaused && (
            <Badge variant="secondary" className="text-xs">
              Paused
            </Badge>
          )}

          {/* Last refresh time */}
          {lastRefresh && (
            <span className="text-xs">
              Updated {formatLastRefresh(lastRefresh)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
