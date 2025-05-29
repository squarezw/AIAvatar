
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { AvatarCard } from "@/components/AvatarCard";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();
  const [avatars] = useState([
    { id: "001", name: "数字人-001" }
  ]);

  const handleCreateAvatar = () => {
    navigate("/create-avatar");
  };

  const handleEditAvatar = (id: string) => {
    navigate(`/edit-avatar/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <div className="container max-w-6xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">我的数字人</h1>
            <Button onClick={handleCreateAvatar}>
              + 新建数字人
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {avatars.map((avatar) => (
              <AvatarCard
                key={avatar.id}
                id={avatar.id}
                name={avatar.name}
                onClick={() => handleEditAvatar(avatar.id)}
              />
            ))}
            
            <AvatarCard
              id="create"
              name="创建新数字人"
              isCreateCard
              onClick={handleCreateAvatar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
