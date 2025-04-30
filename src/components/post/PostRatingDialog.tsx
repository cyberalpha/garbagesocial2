
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PostRatingDialogProps {
  postId: string;
  claimedBy: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => void;
}

const PostRatingDialog: React.FC<PostRatingDialogProps> = ({
  postId,
  claimedBy,
  open,
  onOpenChange,
  onRefresh
}) => {
  const [loading, setLoading] = useState(false);

  const handleCompleteCollection = async (rating: 'positive' | 'neutral' | 'negative') => {
    if (!claimedBy) return;
    
    try {
      setLoading(true);
      
      const updateData: Record<string, any> = {
        status: 'collected',
        publisher_rating: rating
      };
      
      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId);
        
      if (error) throw error;
      
      // Fixed approach: Use a direct update with an increment expression
      // This avoids type issues with the previous approach
      const ratingField = `${rating}_ratings`;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ [ratingField]: supabase.sql`${ratingField} + 1` })
        .eq('id', claimedBy);
        
      if (profileError) throw profileError;
      
      toast({
        title: "Recolección completada",
        description: "Gracias por contribuir al reciclaje",
      });
      
      onOpenChange(false);
      onRefresh();
    } catch (error: any) {
      console.error("Error completing collection:", error);
      toast({
        title: "Error",
        description: error.message || 'Error al completar la recolección',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Calificar al publicador</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-center mb-4">¿Cómo calificarías tu experiencia con esta recolección?</p>
          
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="flex flex-col items-center p-4"
              onClick={() => handleCompleteCollection('positive')}
              disabled={loading}
            >
              <ThumbsUp className="h-8 w-8 text-green-500 mb-2" />
              <span>Positiva</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex flex-col items-center p-4"
              onClick={() => handleCompleteCollection('neutral')}
              disabled={loading}
            >
              <Meh className="h-8 w-8 text-amber-500 mb-2" />
              <span>Neutral</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex flex-col items-center p-4"
              onClick={() => handleCompleteCollection('negative')}
              disabled={loading}
            >
              <ThumbsDown className="h-8 w-8 text-red-500 mb-2" />
              <span>Negativa</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostRatingDialog;
