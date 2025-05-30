
import React from "react";
import { cn } from "@/lib/utils";

export type Step = {
  id: string;
  label: string;
  status: "complete" | "active" | "pending";
};

interface ProgressStepsProps {
  steps: Step[];
  className?: string;
}

export function ProgressSteps({ steps, className }: ProgressStepsProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="progress-bar">
        {steps.map((step, index) => {
          const position = (100 / (steps.length - 1)) * index;
          
          // Calculate completed line width
          let completedLineWidth = 0;
          if (steps.filter((s) => s.status === "complete").length === steps.length) {
            completedLineWidth = 100;
          } else {
            // Find last complete index using reverse iteration
            let lastCompleteIndex = -1;
            for (let i = steps.length - 1; i >= 0; i--) {
              if (steps[i].status === "complete") {
                lastCompleteIndex = i;
                break;
              }
            }
            
            const activeIndex = steps.findIndex((s) => s.status === "active");
            
            if (lastCompleteIndex >= 0) {
              completedLineWidth = (100 / (steps.length - 1)) * lastCompleteIndex;
            }
            
            if (activeIndex >= 0) {
              // Add half step for active
              completedLineWidth = (100 / (steps.length - 1)) * (lastCompleteIndex + 0.5);
            }
          }
          
          // Active line width
          const activeLineWidth = steps.some(s => s.status === "active") ? 
            (100 / (steps.length - 1)) / 2 : 0;
          
          return (
            <React.Fragment key={step.id}>
              <div 
                className={cn(
                  "progress-marker",
                  step.status === "complete" && "complete",
                  step.status === "active" && "active"
                )}
                style={{ left: `${position}%` }}
              >
                {step.status === "complete" ? "✓" : ""}
              </div>
              
              {/* Draw lines */}
              {index === 0 && (
                <>
                  <div 
                    className="progress-line" 
                    style={{ width: `${completedLineWidth}%` }}
                  />
                  {activeLineWidth > 0 && (
                    <div 
                      className="progress-line pending" 
                      style={{ 
                        width: `${activeLineWidth}%`,
                        left: `${completedLineWidth}%`
                      }}
                    />
                  )}
                </>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-8">
        {steps.map((step) => (
          <div 
            key={step.id}
            className={cn(
              "text-sm font-medium text-center flex-1",
              step.status === "complete" && "text-green-600",
              step.status === "active" && "text-primary",
              step.status === "pending" && "text-gray-400"
            )}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
