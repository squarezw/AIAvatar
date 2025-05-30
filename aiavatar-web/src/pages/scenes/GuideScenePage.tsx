
import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GuideScenePage() {
  const [avatars] = useState([
    { id: "001", name: "数字人-001" }
  ]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <div className="container max-w-6xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">景区向导</h1>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">选择您的数字人</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {avatars.map((avatar) => (
                    <div 
                      key={avatar.id} 
                      className="p-4 border rounded-lg cursor-pointer hover:border-primary"
                    >
                      <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                        <span className="text-gray-500">预览</span>
                      </div>
                      <p className="font-medium text-center">{avatar.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">景区信息</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">景区名称</label>
                    <input type="text" className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">景点介绍</label>
                    <textarea className="w-full h-24 p-2 border rounded resize-none" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">路线规划</label>
                    <textarea className="w-full h-24 p-2 border rounded resize-none" placeholder="描述景区游览路线、重点景点等..." />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button>生成导览视频</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
