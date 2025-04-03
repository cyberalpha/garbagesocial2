
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useParams, useNavigate } from 'react-router-dom';
import { WasteCategory } from '@/types';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from '@/components/ui/use-toast';

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LocationPicker from '@/components/LocationPicker';
import ImageUpload from '@/components/ImageUpload';
import { Camera, MapPin, ArrowLeft } from 'lucide-react';

// Esquema de validación para edición de publicación
const editPostSchema = z.object({
  title: z.string().min(5, {
    message: "El título debe tener al menos 5 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  category: z.enum(["organic", "paper", "glass", "plastic", "metal", "sanitary", "dump", "various"], {
    required_error: "Por favor selecciona una categoría.",
  }),
  address: z.string().optional(),
});

type EditPostFormValues = z.infer<typeof editPostSchema>;

const EditPost = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [editCount, setEditCount] = useState(0);
  const [canEdit, setCanEdit] = useState(true);
  
  // Formulario de edición de publicación
  const form = useForm<EditPostFormValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "organic",
      address: "",
    },
  });

  // Cargar datos de la publicación
  useEffect(() => {
    const fetchPost = async () => {
      if (!user || !id) return;
      
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          toast({
            title: "Error",
            description: "No tienes permiso para editar esta publicación",
            variant: "destructive",
          });
          navigate('/profile');
          return;
        }
        
        // Verificar si aún se puede editar
        setEditCount(data.edit_count || 0);
        setCanEdit(data.status === 'available' && (data.edit_count || 0) < 1);
        
        // Rellenar el formulario con los datos existentes
        form.reset({
          title: data.title,
          description: data.description,
          category: data.category as WasteCategory,
          address: data.address || '',
        });
        
        // Establecer ubicación e imagen
        setLocation({
          lat: data.lat,
          lng: data.lng
        });
        
        if (data.image_url) {
          setImageUrl(data.image_url);
        }
      } catch (error: any) {
        console.error("Error loading post:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la publicación",
          variant: "destructive",
        });
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [user, id, navigate, form]);

  // Manejar envío del formulario
  async function onSubmit(values: EditPostFormValues) {
    if (!user || !id || !location || !canEdit) return;
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('posts')
        .update({
          title: values.title,
          description: values.description,
          category: values.category,
          address: values.address || `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`,
          image_url: imageUrl || null,
          edit_count: editCount + 1,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Publicación actualizada",
        description: "Tu publicación se ha actualizado correctamente.",
      });

      navigate('/profile');
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la publicación",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container py-10 max-w-2xl">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10 max-w-2xl">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/profile')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Editar Publicación</h1>
        </div>
        
        {!canEdit ? (
          <div className="bg-amber-100 p-4 rounded-lg text-amber-800 mb-4">
            Esta publicación ya no puede ser editada porque ha sido modificada previamente o ya no está disponible.
          </div>
        ) : null}
        
        <Card>
          <CardHeader>
            <CardTitle>Información de la publicación</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título de tu publicación" {...field} disabled={!canEdit} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canEdit}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="organic">Orgánico</SelectItem>
                          <SelectItem value="paper">Papel</SelectItem>
                          <SelectItem value="glass">Vidrio</SelectItem>
                          <SelectItem value="plastic">Plástico</SelectItem>
                          <SelectItem value="metal">Metal</SelectItem>
                          <SelectItem value="sanitary">Control Sanitario</SelectItem>
                          <SelectItem value="dump">Basurales</SelectItem>
                          <SelectItem value="various">Varios</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe lo que estás publicando, su estado, cantidades, etc." 
                          className="min-h-[100px]"
                          {...field}
                          disabled={!canEdit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel htmlFor="image">Imagen (opcional)</FormLabel>
                  {imageUrl && (
                    <div className="mb-2">
                      <img 
                        src={imageUrl} 
                        alt="Imagen actual" 
                        className="w-full max-h-64 object-cover rounded-md"
                      />
                    </div>
                  )}
                  {canEdit && (
                    <ImageUpload
                      bucketName="post_images"
                      folderPath={user!.id}
                      onImageUploaded={setImageUrl}
                      existingImageUrl={imageUrl}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <FormLabel className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    Ubicación
                  </FormLabel>
                  <LocationPicker value={location} onChange={canEdit ? setLocation : undefined} />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección o ubicación detallada (opcional)" {...field} disabled={!canEdit} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={submitting || !canEdit}>
                  {submitting ? "Actualizando..." : "Guardar cambios"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditPost;
