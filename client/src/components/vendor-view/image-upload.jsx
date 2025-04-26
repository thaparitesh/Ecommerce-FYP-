import React, { useState, useCallback } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';

const ImageUpload = ({ onUploadComplete, onLoadingChange, id, initialImage }) => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialImage || '');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = React.useRef(null);

  const handleImageChange = useCallback(async (file) => {
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsLoading(true);
    onLoadingChange(true);

    try {
      const formData = new FormData();
      formData.append('my_file', file);
      const response = await axios.post(
        'http://localhost:5000/api/admin/products/upload-image',
        formData
      );

      if (response.data?.success) {
        onUploadComplete(response.data.result.url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
      onLoadingChange(false);
    }
  }, [onUploadComplete, onLoadingChange]);

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageChange(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    onUploadComplete('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div 
      className="border-2 border-dashed rounded-lg p-4 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Input
        id={id}
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleFileInputChange}
        accept="image/*"
      />
      
      {!previewUrl ? (
        <Label htmlFor={id} className="flex flex-col items-center justify-center h-32 cursor-pointer">
          <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
          <span>Drag & drop or click to upload image</span>
        </Label>
      ) : isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative w-full h-32 mb-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain rounded-md"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ImageUpload);