
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SupabaseConnectionCheck = () => {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Intentar hacer una consulta simple a la base de datos
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);

        if (error) {
          throw error;
        }

        setConnectionStatus('success');
      } catch (err) {
        console.error('Error de conexión con Supabase:', err);
        setConnectionStatus('error');
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    checkConnection();
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {connectionStatus === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
          {connectionStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {connectionStatus === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
          Estado de la Base de Datos
        </CardTitle>
        <CardDescription>
          Verificación de conectividad con Supabase
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connectionStatus === 'loading' && (
          <p className="text-gray-600">Verificando conexión...</p>
        )}
        {connectionStatus === 'success' && (
          <p className="text-green-600 font-medium">✅ Conexión exitosa con la base de datos</p>
        )}
        {connectionStatus === 'error' && (
          <div>
            <p className="text-red-600 font-medium">❌ Error de conexión</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectionCheck;
