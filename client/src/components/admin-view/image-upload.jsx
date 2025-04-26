import React, { useEffect, useRef } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';

function ProductImageUpload({ imageFile, setImageFile, uploadedImageUrl, setUploadedImageUrl, setImageLoadingState, imageLoadingState, isEditMode }) {
    const inputRef = useRef(null);
    console.log(isEditMode);
    

    function handleImageFileChange(event) {
        console.log(event.target.files);
        const selectedFile = event.target.files?.[0];
        if (selectedFile) setImageFile(selectedFile);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) setImageFile(droppedFile);
    }

    function handleRemoveImage() {
        setImageFile(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    console.log(imageFile);

    async function uploadImageToCloudinary() {
        setImageLoadingState(true)
        const data = new FormData();
        data.append('my_file', imageFile);
        const response = await axios.post('http://localhost:5000/api/admin/products/upload-image', data);
        console.log(response, 'response');
        
        if (response.data?.success) {
            setUploadedImageUrl(response.data.result.url);
            setImageLoadingState(false)
    }}

    useEffect(() => {
        if (imageFile !== null) uploadImageToCloudinary();
    }, [imageFile]);

    return (
        <div className='p-6 w-full max-w-xxxl mx-auto bg-white rounded-lg shadow-accent-foreground'> 
                <Label className='block text-sm font-medium text-gray-700 mb-1'>Upload Image</Label>
                <div 
                    onDragOver={handleDragOver} 
                    onDrop={handleDrop} 
                    className={`${isEditMode ? 'opacity-60' : ''}
                    border-2 border-dashed rounded-lg p-4 text-center`}
                >
                    <Input 
                        id='image-upload' 
                        type='file' 
                        className='hidden' 
                        ref={inputRef} 
                        onChange={handleImageFileChange} 
                        
                    />
                    {
                        !imageFile ? (
                            <Label htmlFor='image-upload' 
                            className={`${isEditMode ? 'cursor-not-allowed' : ''
                            }flex flex-col items-center justify-center h-32 cursor-pointer`}>
                                <UploadCloudIcon className='w-10 h-10 text-muted-foreground mb-2' />
                                <span>Drag & drop or click to upload image</span>
                            </Label>
                        ) : (
                            imageLoadingState ?
                            <Skeleton className='h-10 bg-gray-100' /> :
                            <div className='flex items-center justify-between p-2 border rounded-md'>
                                <div className='flex items-center'>
                                    <FileIcon className='w-8 text-primary mr-2 h-8' />
                                    <p className='text-sm font-medium'>{imageFile.name}</p>
                                </div>
                                <Button variant='ghost' size='icon' className='text-muted-foreground hover:text-foreground' onClick={handleRemoveImage}>
                                    <XIcon className='w-4 h-4' />
                                    <span className='sr-only'>Remove File</span>
                                </Button>
                            </div>
                        )
                    }
                </div>
            </div>
       
    );
}

export default ProductImageUpload;
