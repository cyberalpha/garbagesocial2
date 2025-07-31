
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Post } from '@/types';
import PostHeader from './post/PostHeader';
import PostMetadata from './post/PostMetadata';
import PostActions from './post/PostActions';
import PostEditDialog from './post/PostEditDialog';
import PostRatingDialog from './post/PostRatingDialog';

interface PostDetailsProps {
  post: Post;
  onRefresh: () => void;
}

const PostDetails: React.FC<PostDetailsProps> = ({ post, onRefresh }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distanceToPost, setDistanceToPost] = useState<number | null>(null);
  const [canComplete, setCanComplete] = useState(false);

  const isClaimedByCurrentUser = post.claimedBy === user?.id;
  const canEditPost = post.userId === user?.id && post.status === 'available';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(userLocation);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!currentLocation || !window.google || !window.google.maps) return;
    
    const calculateDistance = () => {
      const origin = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng);
      const destination = new window.google.maps.LatLng(post.location.lat, post.location.lng);
      
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(origin, destination);
      return distance; // en metros
    };

    const distance = calculateDistance();
    setDistanceToPost(distance);
    
    setCanComplete(distance < 100);
  }, [currentLocation, post]);

  const handleClaimPost = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claim-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          postId: post.id,
          userId: user.id
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al reclamar la publicación');
      }
      
      toast({
        title: "Publicación reclamada",
        description: data.message,
      });
      
      onRefresh();
    } catch (error: any) {
      console.error("Error claiming post:", error);
      toast({
        title: "Error",
        description: error.message || 'Error al reclamar la publicación',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!user || post.userId !== user.id) return;

    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id)
        .eq('user_id', user.id); // Extra seguridad para asegurar que solo el dueño puede eliminar

      if (error) throw error;

      toast({
        title: "¡Éxito!",
        description: "La publicación ha sido eliminada correctamente.",
      });

      // Redirigir a la página principal después de eliminar
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la publicación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <PostHeader
          title={post.title}
          category={post.category}
          canEditPost={canEditPost}
          onEdit={() => setShowEditDialog(true)}
          onDelete={handleDeletePost}
        />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{post.description}</p>
        
        <PostMetadata 
          username={post.username}
          createdAt={post.createdAt}
          address={post.location.address}
          distanceToPost={distanceToPost}
        />
        
        <PostActions 
          status={post.status}
          userId={user?.id}
          postUserId={post.userId}
          isClaimedByCurrentUser={isClaimedByCurrentUser}
          canComplete={canComplete}
          loading={loading}
          onClaim={handleClaimPost}
          onOpenRatingDialog={() => setShowRatingDialog(true)}
        />
      </CardContent>
      
      <PostEditDialog 
        postId={post.id}
        userId={user?.id || ''}
        title={post.title}
        description={post.description}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onRefresh={onRefresh}
      />
      
      <PostRatingDialog 
        postId={post.id}
        claimedBy={post.claimedBy}
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        onRefresh={onRefresh}
      />
    </Card>
  );
};

export default PostDetails;
