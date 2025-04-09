
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PostActionsProps {
  status: 'available' | 'claimed' | 'collected';
  userId: string | undefined;
  postUserId: string;
  isClaimedByCurrentUser: boolean;
  canComplete: boolean;
  loading: boolean;
  onClaim: () => void;
  onOpenRatingDialog: () => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  status,
  userId,
  postUserId,
  isClaimedByCurrentUser,
  canComplete,
  loading,
  onClaim,
  onOpenRatingDialog
}) => {
  if (status === 'available' && userId && postUserId !== userId) {
    return (
      <Button 
        className="w-full mt-4" 
        onClick={onClaim}
        disabled={loading}
      >
        {loading ? "Procesando..." : "Reclamar para recolección"}
      </Button>
    );
  }
  
  if (isClaimedByCurrentUser && status === 'claimed') {
    return (
      <div className="space-y-2">
        <div className="bg-amber-100 p-3 rounded-md text-amber-800 text-sm">
          Has reclamado este residuo. Tienes 15 minutos para recogerlo o será liberado automáticamente.
        </div>
        
        {canComplete ? (
          <Button 
            className="w-full" 
            onClick={onOpenRatingDialog}
          >
            <Check className="mr-2 h-4 w-4" />
            Confirmar recolección
          </Button>
        ) : (
          <Button 
            className="w-full" 
            disabled
          >
            Debes estar cerca para confirmar la recolección
          </Button>
        )}
      </div>
    );
  }
  
  if (status === 'collected') {
    return (
      <div className="bg-green-100 p-3 rounded-md text-green-800 text-sm">
        Este residuo ha sido recolectado exitosamente.
      </div>
    );
  }
  
  return null;
};

export default PostActions;
