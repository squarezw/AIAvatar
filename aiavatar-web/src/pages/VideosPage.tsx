import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Upload, PlayCircle, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function VideosPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [myVideos, setMyVideos] = useState<string[]>([]);
  
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('my_videos') || '[]');
    setMyVideos(saved);
  }, []);
  
  const handlePlayToggle = (videoId: string) => {
    const video = document.getElementById(videoId) as HTMLVideoElement;
    
    if (currentVideo && currentVideo !== videoId) {
      const prevVideo = document.getElementById(currentVideo) as HTMLVideoElement;
      prevVideo?.pause();
    }
    
    if (video) {
      if (isPlaying && currentVideo === videoId) {
        video.pause();
        setIsPlaying(false);
      } else {
        video.play();
        setIsPlaying(true);
        setCurrentVideo(videoId);
        
        video.onended = () => {
          setIsPlaying(false);
          setCurrentVideo(null);
        };
      }
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <div className="container max-w-6xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">我的视频</h1>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              上传视频
            </Button>
          </div>
          
          {/* 我的生成视频 */}
          <h2 className="text-xl font-bold mb-4 text-gray-900">我的生成视频</h2>
          {myVideos.length === 0 ? (
            <div className="text-gray-500 mb-8">暂无生成视频</div>
          ) : (
            <div className="grid gap-6 mb-8">
              {myVideos.map(url => (
                <video key={url} src={url} controls className="w-full max-w-2xl rounded shadow mb-4" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
