
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Pencil, UserCircle, Building2, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/ImageUpload';

const Profile = () => {
  const { profile, user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [type, setType] = useState<'individual' | 'organization'>(profile?.type as any || 'individual');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [loading, setLoading] = useState(false);

  if (!profile) {
    return (
      <Layout>
        <div className="container py-10">
          <div className="text-center">Cargando perfil...</div>
        </div>
      </Layout>
    );
  }

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          type,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente.",
      });
      
      setEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setName(profile.name);
    setType(profile.type as any);
    setAvatarUrl(profile.avatar_url || '');
    setEditing(false);
  };

  return (
    <Layout>
      <div className="container py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
        
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            {editing ? (
              <div className="flex flex-col items-center">
                <ImageUpload
                  bucketName="profile_images"
                  folderPath={user!.id}
                  onImageUploaded={setAvatarUrl}
                  existingImageUrl={avatarUrl}
                />
              </div>
            ) : (
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-xl">
                  {profile.name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className="flex flex-col flex-1">
              {editing ? (
                <>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-2"
                    placeholder="Nombre"
                  />
                  <RadioGroup
                    value={type}
                    onValueChange={(value) => setType(value as 'individual' | 'organization')}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="flex items-center">
                        <UserCircle className="mr-1 h-4 w-4" /> Persona
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="organization" id="organization" />
                      <Label htmlFor="organization" className="flex items-center">
                        <Building2 className="mr-1 h-4 w-4" /> Organización
                      </Label>
                    </div>
                  </RadioGroup>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">{profile.name}</h2>
                  <div className="flex items-center text-muted-foreground">
                    {profile.type === 'individual' ? (
                      <UserCircle className="mr-1 h-4 w-4" />
                    ) : (
                      <Building2 className="mr-1 h-4 w-4" />
                    )}
                    <span>{profile.type === 'individual' ? 'Persona' : 'Organización'}</span>
                  </div>
                </>
              )}
              <div className="text-sm text-muted-foreground mt-1">
                {user?.email}
              </div>
            </div>
            
            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelEdit} 
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleSaveProfile} 
                    disabled={loading || !name.trim()}
                  >
                    {loading ? (
                      <>Guardando...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{profile.positive_ratings || 0}</div>
                <div className="text-sm text-muted-foreground">Positivas</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{profile.neutral_ratings || 0}</div>
                <div className="text-sm text-muted-foreground">Neutrales</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{profile.negative_ratings || 0}</div>
                <div className="text-sm text-muted-foreground">Negativas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-semibold mb-4">Mis Publicaciones</h2>
        <div className="text-center py-8 text-muted-foreground">
          No has realizado publicaciones aún.
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
