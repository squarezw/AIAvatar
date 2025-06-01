import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadField } from "@/components/UploadField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { ProgressSteps, type Step } from "@/components/ProgressSteps";
import { API_VIDEO_URL, API_FILE_URL, API_BASE_URL } from "../config";

export default function CreateAvatarPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("video");
  const [avatarName, setAvatarName] = useState("");
  // 新增：音频/视频文件和filename
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFilename, setAudioFilename] = useState("");
  const [videoFilename, setVideoFilename] = useState("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressSteps, setProgressSteps] = useState<Step[] | null>(null);
  const [progressTimer, setProgressTimer] = useState<NodeJS.Timeout | null>(null);
  const [chaofen] = useState(0);
  const [pn] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [progressValue, setProgressValue] = useState<number | null>(null);
  const [currentTaskCode, setCurrentTaskCode] = useState<string | null>(null);

  // 工具函数：根据环境切换 API 地址
  const isDev = import.meta.env.DEV;
  const uploadUrl = isDev ? '/upload' : `${API_FILE_URL}/upload`;
  const submitUrl = isDev ? '/easy/submit' : `${API_VIDEO_URL}/easy/submit`;

  // 上传音频
  async function handleAudioUpload(file: File) {
    setUploadingAudio(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(uploadUrl, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "音频上传失败");
        return;
      }
      setAudioFilename(data.filename);
    } catch (e) {
      setError("音频上传失败");
    } finally {
      setUploadingAudio(false);
    }
  }
  // 上传视频
  async function handleVideoUpload(file: File) {
    setUploadingVideo(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(uploadUrl, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "视频上传失败");
        return;
      }
      setVideoFilename(data.filename);
    } catch (e) {
      setError("视频上传失败");
    } finally {
      setUploadingVideo(false);
    }
  }

  // 生成数字人
  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setProgressSteps([
      { id: "1", label: "音频上传", status: "complete" },
      { id: "2", label: "视频上传", status: "complete" },
      { id: "3", label: "数字人生成中", status: "active" },
      { id: "4", label: "完成", status: "pending" },
    ]);
    setCurrentTaskCode(null);
    try {
      const code = uuidv4();
      setCurrentTaskCode(code);
      const submitBody = {
        audio_url: audioFilename,
        video_url: videoFilename,
        code,
        chaofen,
        watermark_switch: 0,
        pn,
      };
      await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitBody),
      });
      // 提交成功后开始轮询进度
      pollProgress(code);
    } catch (e) {
      setError("生成失败");
      setLoading(false);
    }
  }

  // 轮询进度
  function pollProgress(code: string) {
    let steps: Step[] = [
      { id: "1", label: "音频上传", status: "complete" },
      { id: "2", label: "视频上传", status: "complete" },
      { id: "3", label: "数字人生成中", status: "pending" },
      { id: "4", label: "完成", status: "pending" },
    ];
    setProgressSteps([...steps]);
    setProgressMsg("");
    setProgressValue(null);
    const timer = setInterval(async () => {
      try {
        const queryUrl = isDev
          ? `/easy/query?code=${code}`
          : `${API_VIDEO_URL}/easy/query?code=${code}`;
        const res = await fetch(queryUrl);
        const result = await res.json();
        if (result.data && result.data.msg) {
          setProgressMsg(result.data.msg);
        }
        if (result.data && typeof result.data.progress === "number") {
          setProgressValue(result.data.progress);
        }
        if (result.code === 10004) {
          setError("任务不存在或失败");
          setLoading(false);
          clearInterval(timer);
        } else if (result.data && typeof result.data.progress === "number") {
          const progress = result.data.progress;
          if (progress < 50) {
            steps[2].status = "active";
            steps[3].status = "pending";
          } else if (progress < 100) {
            steps[2].status = "complete";
            steps[3].status = "active";
          } else if (progress === 100) {
            steps[2].status = "complete";
            steps[3].status = "complete";
            setLoading(false);
            clearInterval(timer);
            // 保存视频地址到 localStorage
            const videoUrl = `${API_BASE_URL}/play/temp/${code}-r.mp4`;
            const saved = JSON.parse(localStorage.getItem('my_videos') || '[]');
            const newList = [videoUrl, ...saved.filter((url: string) => url !== videoUrl)];
            localStorage.setItem('my_videos', JSON.stringify(newList.slice(0, 20)));
          }
          setProgressSteps([...steps]);
        }
      } catch (e) {
        setError("进度查询失败");
        setLoading(false);
        clearInterval(timer);
      }
    }, 3000);
    setProgressTimer(timer);
  }

  // 清理定时器
  React.useEffect(() => {
    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [progressTimer]);

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
            <h1 className="text-xl font-semibold">新建数字人</h1>
          </div>
          
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
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="image" className="px-6">图片生数字人</TabsTrigger>
                <TabsTrigger value="video" className="px-6">视频生数字人</TabsTrigger>
              </TabsList>
              
              <TabsContent value="image" className="space-y-6">
                <div>
                  <UploadField 
                    label="图片上传" 
                    type="image"
                    buttonText="上传图片"
                  />
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-medium">语音</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="语音选择" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="voice1">语音 1</SelectItem>
                          <SelectItem value="voice2">语音 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button>开始生成</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="video" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UploadField 
                    label="视频" 
                    type="video"
                    buttonText={uploadingVideo ? "上传中..." : "上传视频"}
                    onFileSelect={file => {
                      setVideoFile(file);
                      handleVideoUpload(file);
                    }}
                  />
                  <div className="space-y-4">
                    <UploadField 
                      label="语音" 
                      type="audio"
                      buttonText={uploadingAudio ? "上传中..." : "上传语音"}
                      onFileSelect={file => {
                        setAudioFile(file);
                        handleAudioUpload(file);
                      }}
                    />
                    <Button 
                      className="w-full" 
                      onClick={handleGenerate}
                      disabled={loading || uploadingAudio || uploadingVideo || !audioFilename || !videoFilename}
                    >
                      {loading ? "生成中..." : "开始生成"}
                    </Button>
                  </div>
                </div>
                {progressSteps && (
                  <div className="mt-8">
                    <ProgressSteps steps={progressSteps} />
                    {progressMsg && <div className="text-blue-600 mt-4 text-center">{progressMsg}</div>}
                    {typeof progressValue === "number" && (
                      <>
                        <progress value={progressValue} max={100} className="w-full h-2 mt-2" />
                        <div className="text-gray-500 text-center">进度：{progressValue}%</div>
                      </>
                    )}
                    {progressValue === 100 && currentTaskCode && (
                      <div className="mt-8 flex flex-col items-center">
                        <div className="mb-2 text-lg font-semibold text-green-600">生成视频预览</div>
                        <video
                          src={`${API_BASE_URL}/play/temp/${currentTaskCode}-r.mp4`}
                          controls
                          className="w-full max-w-2xl rounded shadow"
                        />
                      </div>
                    )}
                  </div>
                )}
                {error && <div className="text-red-500 mt-2">{error}</div>}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

