
import React from 'react';
import Layout from '@/components/Layout';
import SupabaseConnectionCheck from '@/components/SupabaseConnectionCheck';
import StorageBucketInitializer from '@/components/StorageBucketInitializer';
import LogoImage from '@/components/LogoImage';

const SystemCheck = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-gray-900 text-center">
            Validaciones del Sistema
          </h1>
          
          {/* Logo del proyecto usando el componente LogoImage existente */}
          <div className="flex justify-center mb-10">
            <div className="bg-white p-8 rounded-full shadow-lg">
              <LogoImage 
                size={120} 
                className="hover:scale-105 transition-transform duration-300" 
              />
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SupabaseConnectionCheck />
            <StorageBucketInitializer />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SystemCheck;
