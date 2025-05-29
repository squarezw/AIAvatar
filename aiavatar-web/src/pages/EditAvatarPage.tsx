
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadField } from "@/components/UploadField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

// Mock avatar data - in a real application, this would come from an API or database
const mockAvatarData = [
  { 
    id: "001", 
    name: "数字人-001", 
    type: "image" as const,
    voiceId: "voice1" 
  }
];

export default function EditAvatarPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [avatarData, setAvatarData] = useState<{
    id: string;
    name: string;
    type: "image" | "video";
    voiceId?: string;
  } | null>(null);
  
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");
  const [avatarName, setAvatarName] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  
  // Fetch avatar data
  useEffect(() => {
    // In a real app, this would be an API call
    const avatar = mockAvatarData.find(avatar => avatar.id === id);
    
    if (avatar) {
      setAvatarData(avatar);
      setAvatarName(avatar.name);
      setActiveTab(avatar.type);
      if (avatar.voiceId) {
        setSelectedVoice(avatar.voiceId);
      }
    }
  }, [id]);
  
  const handleSave = () => {
    // In a real app, this would update the avatar data via an API
    console.log("Saving avatar:", {
      id,
      name: avatarName,
      type: activeTab,
      voiceId: selectedVoice
    });
    
    // Navigate back to the avatars list
    navigate("/");
  };
  
  if (!avatarData) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <p>Loading avatar data...</p>
        </div>
      </div>
    );
  }
  
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
            <h1 className="text-xl font-semibold">编辑数字人</h1>
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-400">{avatarData.id}</span>
                </div>
                <div>
                  <p className="font-bold text-lg">{avatarData.name}</p>
                  <p className="text-sm text-gray-500">
                    {avatarData.type === "image" ? "图片生成数字人" : "视频生成数字人"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">数字人昵称</label>
              <Input 
                placeholder="请输入数字人昵称" 
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "image" | "video")}>
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="image" className="px-6">图片生数字人</TabsTrigger>
                <TabsTrigger value="video" className="px-6">视频生数字人</TabsTrigger>
              </TabsList>
              
              <TabsContent value="image" className="space-y-6">
                <div>
                  <UploadField 
                    label="更换图片" 
                    type="image"
                    buttonText="上传图片"
                  />
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-medium">语音</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger>
                          <SelectValue placeholder="语音选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="voice1">语音 1</SelectItem>
                          <SelectItem value="voice2">语音 2</SelectItem>
                          <SelectItem value="voice3">语音 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="video" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UploadField 
                    label="更换视频" 
                    type="video"
                    buttonText="上传视频"
                  />
                  
                  <div className="space-y-4">
                    <UploadField 
                      label="更换语音" 
                      type="audio"
                      buttonText="上传语音"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                取消
              </Button>
              <Button onClick={handleSave}>
                保存变更
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
