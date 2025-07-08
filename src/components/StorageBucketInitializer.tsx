
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const StorageBucketInitializer = () => {
  const [bucketStatus, setBucketStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [buckets, setBuckets] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const checkBuckets = async () => {
      try {
        const { data, error } = await supabase.storage.listBuckets();

        if (error) {
          throw error;
        }

        setBuckets(data || []);
        setBucketStatus('success');
      } catch (err) {
        console.error('Error al verificar buckets de almacenamiento:', err);
        setBucketStatus('error');
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    };

    checkBuckets();
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {bucketStatus === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
          {bucketStatus === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {bucketStatus === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
          <Database className="h-5 w-5" />
          Almacenamiento (Storage)
        </CardTitle>
        <CardDescription>
          Verificación de buckets de almacenamiento
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bucketStatus === 'loading' && (
          <p className="text-gray-600">Verificando buckets de almacenamiento...</p>
        )}
        {bucketStatus === 'success' && (
          <div>
            <p className="text-green-600 font-medium mb-3">✅ Almacenamiento verificado exitosamente</p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Buckets disponibles:</p>
              {buckets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {buckets.map((bucket) => (
                    <div key={bucket.id} className="bg-gray-50 p-2 rounded text-sm">
                      <span className="font-medium">{bucket.name}</span>
                      <span className="text-gray-500 ml-2">
                        ({bucket.public ? 'Público' : 'Privado'})
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No hay buckets configurados</p>
              )}
            </div>
          </div>
        )}
        {bucketStatus === 'error' && (
          <div>
            <p className="text-red-600 font-medium">❌ Error al verificar almacenamiento</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StorageBucketInitializer;
