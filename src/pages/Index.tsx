
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PostCard from '@/components/PostCard';
import CategoryFilter from '@/components/CategoryFilter';
import { WasteCategory, Post } from '../types';
import { Recycle, Search, ArrowRight, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<WasteCategory[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPosts();
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPosts = async () => {
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
        .eq('status', 'available')
        .order('created_at', { ascending: false });
        
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
        
        const profilesMap = (profilesData || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);
        
        const formattedPosts = data.map(post => ({
          id: post.id,
          userId: post.user_id,
          username: profilesMap[post.user_id]?.name || 'Usuario',
          userAvatar: profilesMap[post.user_id]?.avatar_url || '',
          category: post.category as WasteCategory,
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

  const handleCategoryToggle = (category: WasteCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.address.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(post.category);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="home-gradient">
        <div className="container py-10">
          {/* Hero Section with new gradient */}
          <section className="relative hero-gradient text-gray-800 py-16 rounded-xl shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="md:w-2/3">
                <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                  Tu basura es nuestro tesoro
                </h1>
                <p className="text-xl mb-8">
                  Conectamos a personas que tienen desechos con quienes pueden reciclarlos y darles una segunda vida.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {user ? (
                    <Button 
                      size="lg" 
                      className="bg-primary text-white hover:bg-primary/90"
                      asChild
                    >
                      <a href="/new-post">Publicar Residuo</a>
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="bg-primary text-white hover:bg-primary/90"
                      asChild
                    >
                      <a href="/auth">
                        <LogIn className="mr-2 h-4 w-4" />
                        Iniciar Sesión
                      </a>
                    </Button>
                  )}
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary/10"
                    asChild
                  >
                    <a href={user ? "/map" : "/auth"}>Ver Mapa</a>
                  </Button>
                </div>
              </div>
            </div>
            <div className="hidden lg:block absolute bottom-0 right-0 w-1/3 h-full">
              <div className="relative h-full">
                <img 
                  src="/lovable-uploads/075fd805-57c3-4529-9440-17306830124a.png" 
                  alt="Recycling Logo" 
                  className="absolute bottom-10 right-20 w-64 h-64" 
                />
              </div>
            </div>
          </section>

          {user ? (
            <>
              {/* Search and Filter Section */}
              <section className="py-8 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="relative w-full md:w-1/2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        type="text"
                        placeholder="Buscar por título, descripción o ubicación..."
                        className="w-full pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="link" 
                      className="text-primary flex items-center"
                      asChild
                    >
                      <a href="/map">
                        Ver todos en el mapa
                        <ArrowRight size={16} className="ml-1" />
                      </a>
                    </Button>
                  </div>
                  
                  <CategoryFilter
                    selectedCategories={selectedCategories}
                    onCategoryToggle={handleCategoryToggle}
                  />
                </div>
              </section>

              {/* Posts List */}
              <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-2xl font-bold mb-6">Residuos Disponibles</h2>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-gray-500">Cargando publicaciones...</p>
                    </div>
                  ) : filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No se encontraron resultados que coincidan con tu búsqueda.</p>
                      <Button 
                        variant="link" 
                        className="text-primary mt-2"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategories([]);
                        }}
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  )}
                </div>
              </section>
            </>
          ) : (
            <section className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Regístrate y comienza a reciclar</h2>
                <p className="text-xl text-gray-600 mb-8 md:w-2/3 mx-auto">
                  Para acceder a todas las características de la aplicación, incluyendo la visualización de residuos disponibles, es necesario iniciar sesión.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                    asChild
                  >
                    <a href="/auth">Iniciar Sesión</a>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    asChild
                  >
                    <a href="/about">Saber Más</a>
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Únete al movimiento del reciclaje</h2>
              <p className="text-xl text-gray-600 mb-8 md:w-2/3 mx-auto">
                Ayuda a crear un planeta más limpio, fomenta la economía circular y forma parte de una comunidad comprometida con el medio ambiente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  asChild
                >
                  <a href="/auth">Regístrate Ahora</a>
                </Button>
                <Button 
                  size="lg" 
                  //variant="outline"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                  asChild
                >
                  <a href="/donations">Donaciones</a>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
