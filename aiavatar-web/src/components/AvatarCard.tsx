
import React from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface AvatarCardProps {
  id: string;
  name: string;
  thumbnail?: string;
  isCreateCard?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AvatarCard({
  id,
  name,
  thumbnail,
  isCreateCard = false,
  onClick,
  className,
}: AvatarCardProps) {
  const navigate = useNavigate();
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-avatar/${id}`);
  };
  
  return (
    <div 
      className={cn(
        "avatar-card flex flex-col rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="relative h-40 bg-muted flex items-center justify-center">
        {isCreateCard ? (
          <div className="text-3xl font-bold text-gray-400">+</div>
        ) : thumbnail ? (
          <img 
            src={thumbnail} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-3xl font-bold text-gray-400">
            <Play className="h-12 w-12" />
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{name}</p>
          {!isCreateCard && (
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0 text-blue-600"
              onClick={handleEdit}
            >
              编辑
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
