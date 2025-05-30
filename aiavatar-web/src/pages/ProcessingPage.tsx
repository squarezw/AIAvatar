
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ProgressSteps, type Step } from "@/components/ProgressSteps";
import { Button } from "@/components/ui/button";

export default function ProcessingPage() {
  const navigate = useNavigate();
  const [source] = useState<"image" | "video">("image");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    // Different steps based on the source type
    if (source === "image") {
      setSteps([
        { id: "1", label: "语音识别完成", status: "complete" },
        { id: "2", label: "语音合成中", status: "active" },
        { id: "3", label: "数字人生成中", status: "pending" }
      ]);
    } else {
      setSteps([
        { id: "1", label: "图片识别完成", status: "complete" },
        { id: "2", label: "视频生成中", status: "active" },
        { id: "3", label: "语音合成中", status: "pending" }
      ]);
    }
    
    // Simulate progress for demo
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          const newSteps = [...steps];
          newSteps[prev].status = "complete";
          newSteps[prev + 1].status = "active";
          setSteps(newSteps);
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            navigate("/");
          }, 2000);
          return prev;
        }
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [source, navigate]);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <div className="container max-w-4xl p-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              className="text-blue-600"
              onClick={() => navigate("/")}
            >
              我的数字人
            </Button>
            <span className="mx-2">→</span>
            <h1 className="text-xl font-semibold">数字人生成中</h1>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-8">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-xl font-semibold mb-6">数字人生成中</h2>
              <p className="text-gray-500">
                请耐心等待，系统正在处理您的请求。处理完成后将自动跳转。
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <ProgressSteps steps={steps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
