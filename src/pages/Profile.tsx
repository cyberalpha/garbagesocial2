
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Pencil, UserCircle, Building2 } from 'lucide-react';

const Profile = () => {
  const { profile, user } = useAuth();

  if (!profile) {
    return (
      <Layout>
        <div className="container py-10">
          <div className="text-center">Cargando perfil...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
        
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-xl">
                {profile.name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <div className="flex items-center text-muted-foreground">
                {profile.type === 'individual' ? (
                  <UserCircle className="mr-1 h-4 w-4" />
                ) : (
                  <Building2 className="mr-1 h-4 w-4" />
                )}
                <span>{profile.type === 'individual' ? 'Persona' : 'Organización'}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {user?.email}
              </div>
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Editar perfil
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{profile.positive_ratings}</div>
                <div className="text-sm text-muted-foreground">Positivas</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{profile.neutral_ratings}</div>
                <div className="text-sm text-muted-foreground">Neutrales</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{profile.negative_ratings}</div>
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
