
import React, { useState, useRef } from 'react';
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  bucketName: string;
  folderPath: string;
  existingImageUrl?: string | null;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  bucketName, 
  folderPath,
  existingImageUrl,
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);

      // Crear un nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${folderPath}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      // Subir el archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      // Obtener la URL pública del archivo
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Pasar la URL al componente padre
      onImageUploaded(publicUrl);
      setPreviewUrl(publicUrl);
      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido con éxito",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error al subir la imagen",
        description: error.message || "Ha ocurrido un error al subir la imagen",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    uploadImage(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
  };

  return (
    <div className={className}>
      {previewUrl ? (
        <div className="image-preview">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover" 
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-0 right-0 rounded-full w-6 h-6"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
      
      <div 
        className={`image-upload-container ${isDragging ? 'dragging' : ''} ${previewUrl ? 'mt-4' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
        />
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        {uploading ? (
          <p className="text-sm text-gray-500">Subiendo imagen...</p>
        ) : (
          <>
            <p className="text-sm font-medium">Haz clic o arrastra una imagen</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hasta 10MB</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
