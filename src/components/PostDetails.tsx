import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Post } from '@/types';
import CategoryBadge from './CategoryBadge';
import { ThumbsUp, ThumbsDown, Meh, MapPin, Calendar, User, Check, X, Edit, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface PostDetailsProps {
  post: Post;
  onRefresh: () => void;
}

// Esquema para edición de post
const editPostSchema = z.object({
  title: z.string().min(5, {
    message: "El título debe tener al menos 5 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
});

type EditPostValues = z.infer<typeof editPostSchema>;

const PostDetails: React.FC<PostDetailsProps> = ({ post, onRefresh }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distanceToPost, setDistanceToPost] = useState<number | null>(null);
  const [canComplete, setCanComplete] = useState(false);

  // Determinar si el post está reclamado por el usuario actual
  const isClaimedByCurrentUser = post.claimedBy === user?.id;

  // Determinar si el usuario puede editar el post
  const canEditPost = post.userId === user?.id && post.status === 'available';

  // Formulario para edición
  const editForm = useForm<EditPostValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: post.title,
      description: post.description || '',
    },
  });

  // Obtener ubicación actual del usuario
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

  // Calcular distancia al post cuando tenemos ubicación actual
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
    
    // Considerar que está cerca si está a menos de 100 metros
    setCanComplete(distance < 100);
  }, [currentLocation, post]);

  // Manejar reclamo de publicación
  const handleClaimPost = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fix 1: Use correct way to get the Supabase URL
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claim-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Fix 2: Use the correct way to get the session token
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

  // Manejar edición de post
  const handleEditPost = async (values: EditPostValues) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('posts')
        .update({
          title: values.title,
          description: values.description
        })
        .eq('id', post.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Publicación actualizada",
        description: "Los cambios han sido guardados correctamente",
      });
      
      setShowEditDialog(false);
      onRefresh();
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: error.message || 'Error al actualizar la publicación',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejar finalización de recolección
  const handleCompleteCollection = async (rating: 'positive' | 'negative' | 'neutral') => {
    if (!user || !post.claimedBy) return;
    
    try {
      setLoading(true);
      
      // Actualizar el estado del post
      const { error } = await supabase
        .from('posts')
        .update({
          status: 'collected',
          // Fix 3: Use a typed field for publisher_rating
          publisher_rating: rating as any
        })
        .eq('id', post.id);
        
      if (error) throw error;
      
      // Actualizar las calificaciones del reciclador
      const ratingField = `${rating}_ratings`;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ [ratingField]: supabase.rpc('increment', { count: 1 }) })
        .eq('id', post.claimedBy);
        
      if (profileError) throw profileError;
      
      toast({
        title: "Recolección completada",
        description: "Gracias por contribuir al reciclaje",
      });
      
      setShowRatingDialog(false);
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

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{post.title}</CardTitle>
            <div className="mt-2">
              <CategoryBadge category={post.category} />
            </div>
          </div>
          
          {canEditPost && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowEditDialog(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{post.description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <User className="h-4 w-4 mr-2" />
            <span>Publicado por {post.username}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Publicado el {formatDate(post.createdAt)}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{post.location.address}</span>
          </div>
          
          {distanceToPost !== null && (
            <div className="text-muted-foreground">
              <span>Distancia: {(distanceToPost / 1000).toFixed(2)} km</span>
              {distanceToPost < 100 && (
                <span className="ml-2 text-green-600 font-medium">¡Estás cerca!</span>
              )}
            </div>
          )}
        </div>
        
        {post.status === 'available' && user && post.userId !== user.id && (
          <Button 
            className="w-full mt-4" 
            onClick={handleClaimPost}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Reclamar para recolección"}
          </Button>
        )}
        
        {isClaimedByCurrentUser && post.status === 'claimed' && (
          <div className="space-y-2">
            <div className="bg-amber-100 p-3 rounded-md text-amber-800 text-sm">
              Has reclamado este residuo. Tienes 15 minutos para recogerlo o será liberado automáticamente.
            </div>
            
            {canComplete ? (
              <Button 
                className="w-full" 
                onClick={() => setShowRatingDialog(true)}
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
        )}
        
        {post.status === 'collected' && (
          <div className="bg-green-100 p-3 rounded-md text-green-800 text-sm">
            Este residuo ha sido recolectado exitosamente.
          </div>
        )}
      </CardContent>
      
      {/* Dialog para editar post */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar publicación</DialogTitle>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditPost)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para calificar */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
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
    </Card>
  );
};

export default PostDetails;
