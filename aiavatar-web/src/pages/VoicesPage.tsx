import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Upload, PlayCircle, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { API_FILE_URL } from "../config";

const isDev = import.meta.env.DEV;
const voiceCloneUrl = isDev ? '/voice-clone' : `${API_FILE_URL}/voice-clone`;
const t2aUrl = isDev ? '/t2a' : `${API_FILE_URL}/t2a`;
const voiceIdsUrl = isDev ? '/voice-ids' : `${API_FILE_URL}/voice-ids`;

export default function VoicesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [voiceId, setVoiceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handlePlayToggle = (voiceId: string) => {
    const audio = document.getElementById(voiceId) as HTMLAudioElement;
    
    if (currentVoice && currentVoice !== voiceId) {
      const prevAudio = document.getElementById(currentVoice) as HTMLAudioElement;
      prevAudio?.pause();
    }
    
    if (audio) {
      if (isPlaying && currentVoice === voiceId) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
        setCurrentVoice(voiceId);
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentVoice(null);
        };
      }
    }
  };
  
  async function handleVoiceClone(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setVoiceId('');
    if (!file) {
      setError('请上传语音文件');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(voiceCloneUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.voice_id) {
        setVoiceId(data.voice_id);
      } else {
        setError(data.error || '语音克隆失败');
      }
    } catch (e) {
      setError('请求失败');
    }
    setLoading(false);
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<string | null>(null);
  
  // 文本转语音 state
  const [ttsText, setTtsText] = useState('');
  const [ttsVoiceIds, setTtsVoiceIds] = useState<string[]>([]);
  const [ttsVoiceId, setTtsVoiceId] = useState('');
  const [ttsAudioUrl, setTtsAudioUrl] = useState('');
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsError, setTtsError] = useState('');

  useEffect(() => {
    fetch(voiceIdsUrl)
      .then(res => res.json())
      .then(data => {
        setTtsVoiceIds(data.voice_ids || []);
        if (data.voice_ids && data.voice_ids.length > 0) {
          setTtsVoiceId(data.voice_ids[0]);
        }
      });
  }, []);

  async function handleTtsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTtsError('');
    setTtsAudioUrl('');
    if (!ttsText.trim()) {
      setTtsError('请输入要合成的文本');
      return;
    }
    if (!ttsVoiceId) {
      setTtsError('请选择 voice_id');
      return;
    }
    setTtsLoading(true);
    try {
      const resp = await fetch(t2aUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ttsText, voice_id: ttsVoiceId })
      });
      const data = await resp.json();
      if (data.audio_url) {
        setTtsAudioUrl(data.audio_url);
      } else {
        setTtsError(data.error || '生成失败');
      }
    } catch (e) {
      setTtsError('请求失败');
    }
    setTtsLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <div className="container max-w-6xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">我的语音</h1>
          </div>
          
          {/* 语音克隆区域 */}
          <form onSubmit={handleVoiceClone} className="mb-8 p-4 bg-white rounded shadow flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 flex flex-col md:flex-row items-center gap-4">
              <input type="file" accept="audio/*" onChange={e => setFile(e.target.files?.[0] || null)} />
              <Button type="submit" disabled={loading || !file} className="min-w-[120px]">
                {loading ? '克隆中...' : '克隆语音'}
              </Button>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">请上传一段清晰的语音样本</div>
              {voiceId && (
                <div className="text-green-600 mt-1">克隆成功！voice_id: <span className="font-bold">{voiceId}</span></div>
              )}
              {error && (
                <div className="text-red-500 mt-1">{error}</div>
              )}
            </div>
          </form>
          
          {/* 文本转语音区域 */}
          <form onSubmit={handleTtsSubmit} className="mb-8 p-4 bg-white rounded shadow flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                placeholder="请输入要合成的文本"
                value={ttsText}
                onChange={e => setTtsText(e.target.value)}
                className="w-full min-h-[60px] border rounded p-2 text-gray-900 bg-white"
              />
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-900">选择 voice_id：</label>
                <select
                  value={ttsVoiceId}
                  onChange={e => setTtsVoiceId(e.target.value)}
                  className="border rounded p-1 text-gray-900 bg-white"
                  style={{ color: '#222', background: '#fff' }}
                >
                  {ttsVoiceIds.map(id => (
                    <option key={id} value={id} className="text-gray-900 bg-white" style={{ color: '#222', background: '#fff' }}>{id}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" disabled={ttsLoading || !ttsText.trim() || !ttsVoiceId} className="w-full md:w-auto mt-2">
                {ttsLoading ? '生成中...' : '生成语音'}
              </Button>
              {ttsError && <div className="text-red-500 mt-1">{ttsError}</div>}
              {ttsAudioUrl && (
                <div className="mt-4 flex flex-col items-center">
                  <audio src={ttsAudioUrl} controls className="w-full max-w-md" />
                  <a href={ttsAudioUrl} download className="text-blue-600 mt-2 underline">下载音频</a>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
