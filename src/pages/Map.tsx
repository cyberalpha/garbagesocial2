
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import MapComponent from '@/components/MapComponent';
import PostsList from '@/components/PostsList';
import { TrashIcon, Route } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Post, WasteCategory } from '@/types';
import CategoryFilter from '@/components/CategoryFilter';

const MapPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [showRoute, setShowRoute] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<WasteCategory[]>([]);

  useEffect(() => {
    fetchAvailablePosts();
  }, []);

  const fetchAvailablePosts = async () => {
    setLoading(true);
    try {
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
          user_id
        `)
        .eq('status', 'available');
        
      if (error) {
        throw error;
      }

      // Fetch profiles in a separate query
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(post => post.user_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name, avatar_url')
          .in('id', userIds);
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }
        
        // Create a map of profiles by user ID for faster lookups
        const profilesMap = (profilesData || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);

        const formattedPosts = data.map(post => ({
          id: post.id,
          userId: post.user_id,
          username: profilesMap[post.user_id]?.name || 'Usuario',
          userAvatar: profilesMap[post.user_id]?.avatar_url || '',
          category: post.category as any,
          title: post.title,
          description: post.description || '',
          imageUrl: post.image_url || undefined,
          location: {
            lat: post.lat,
            lng: post.lng,
            address: post.address
          },
          createdAt: post.created_at,
          status: 'available' as const
        }));
        
        setPosts(formattedPosts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las publicaciones',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostSelect = (post: Post) => {
    setSelectedPosts(prev => {
      const isSelected = prev.some(p => p.id === post.id);
      if (isSelected) {
        return prev.filter(p => p.id !== post.id);
      } else {
        return [...prev, post];
      }
    });
  };

  const handleCreateRoute = () => {
    if (selectedPosts.length > 0) {
      setShowRoute(true);
      toast({
        title: 'Ruta creada',
        description: `Se ha trazado una ruta para recolectar ${selectedPosts.length} residuos`,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Selecciona al menos un punto para crear una ruta',
        variant: 'destructive'
      });
    }
  };

  const handleClearSelection = () => {
    setSelectedPosts([]);
    setShowRoute(false);
  };

  const handleCategoryToggle = (category: WasteCategory) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Filtrar los posts por categoría si hay categorías seleccionadas
  const filteredPosts = selectedCategories.length > 0
    ? posts.filter(post => selectedCategories.includes(post.category))
    : posts;

  return (
    <Layout>
      <div className="container py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Mapa de Residuos Disponibles</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <MapComponent 
                  posts={filteredPosts} 
                  selectedPosts={selectedPosts} 
                  showRoute={showRoute}
                  className="h-[500px] w-full rounded-b-lg"
                />
              </CardContent>
            </Card>
            
            <CategoryFilter 
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
            
            {selectedPosts.length > 0 && (
              <div className="flex justify-between items-center mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <TrashIcon className="text-green-600 mr-2" />
                  <span className="font-medium">
                    {selectedPosts.length} {selectedPosts.length === 1 ? 'residuo' : 'residuos'} seleccionado{selectedPosts.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleClearSelection}
                  >
                    Limpiar
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleCreateRoute}
                  >
                    <Route className="mr-1 h-4 w-4" />
                    Trazar Ruta
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Residuos Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <PostsList 
                  posts={filteredPosts} 
                  loading={loading} 
                  selectedPosts={selectedPosts}
                  onPostSelect={handlePostSelect}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
