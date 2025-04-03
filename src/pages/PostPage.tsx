
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Post, WasteCategory } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import PostDetails from '@/components/PostDetails';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, 
          title, 
          description, 
          category, 
          address,
          lat,
          lng,
          status, 
          image_url,
          created_at,
          user_id,
          claimed_by
        `)
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }

      if (data) {
        // Fetch profile information
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name, avatar_url')
          .eq('id', data.user_id)
          .single();
        
        const formattedPost: Post = {
          id: data.id,
          userId: data.user_id,
          claimedBy: data.claimed_by,
          username: profileData?.name || 'Usuario',
          userAvatar: profileData?.avatar_url || '',
          category: data.category as WasteCategory,
          title: data.title,
          description: data.description || '',
          imageUrl: data.image_url || undefined,
          location: {
            lat: data.lat,
            lng: data.lng,
            address: data.address
          },
          createdAt: data.created_at,
          status: data.status as 'available' | 'claimed' | 'collected'
        };
        
        setPost(formattedPost);
      }
    } catch (error: any) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la publicación",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-10 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <h1 className="text-3xl font-bold">Detalles de la publicación</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : post ? (
          <>
            {post.imageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}
            
            <PostDetails post={post} onRefresh={fetchPost} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">La publicación no se encontró o ha sido eliminada.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PostPage;
