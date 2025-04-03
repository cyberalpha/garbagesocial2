
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
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
import { Camera, MapPin } from 'lucide-react';

// Esquema de validación para nueva publicación (dirección ahora es opcional)
const postSchema = z.object({
  title: z.string().min(5, {
    message: "El título debe tener al menos 5 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  category: z.enum(["organic", "paper", "glass", "plastic", "metal", "sanitary", "dump", "various"], {
    required_error: "Por favor selecciona una categoría.",
  }),
  address: z.string().optional(), // Ahora la dirección es opcional
});

type PostFormValues = z.infer<typeof postSchema>;

const NewPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  // Formulario de nueva publicación
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "organic",
      address: "",
    },
  });

  // Manejar envío del formulario
  async function onSubmit(values: PostFormValues) {
    if (!user) return;
    if (!location) {
      toast({
        title: "Error",
        description: "Por favor selecciona una ubicación en el mapa.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: values.title,
          description: values.description,
          category: values.category,
          address: values.address || `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`, // Usar coordenadas si no hay dirección
          image_url: imageUrl || null,
          lat: location.lat,
          lng: location.lng,
        });

      if (error) throw error;

      toast({
        title: "Publicación creada",
        description: "Tu publicación se ha creado correctamente.",
      });

      navigate('/');
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: error.message || "Error al crear la publicación",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="container py-10 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Nueva Publicación</h1>
        
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
                        <Input placeholder="Título de tu publicación" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel htmlFor="image">Imagen (opcional)</FormLabel>
                  <ImageUpload
                    bucketName="post_images"
                    folderPath={user!.id}
                    onImageUploaded={setImageUrl}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <FormLabel className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    Ubicación
                  </FormLabel>
                  <LocationPicker value={location} onChange={setLocation} />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección o ubicación detallada (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading || !location}>
                  {loading ? "Publicando..." : "Crear publicación"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NewPost;
