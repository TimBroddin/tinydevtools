import { useState, useEffect, ChangeEvent, useRef } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, ArrowLeft, ArrowRight, Download, X, Image as ImageIcon, Settings2 } from 'lucide-react';
// We'll need a JSZip instance later for zipping files
// import JSZip from 'jszip'; // Placeholder for now

interface ResizedImage {
  originalName: string;
  originalType: string;
  originalUrl: string;
  resizedUrl?: string;
  width: number;
  height: number;
  error?: string;
}

const ImageResizeTool = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<ResizedImage[]>([]);
  const [targetWidth, setTargetWidth] = useState<string>('');
  const [targetHeight, setTargetHeight] = useState<string>('');
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [allowCrop, setAllowCrop] = useState<boolean>(false); // Becomes relevant if keepAspectRatio is true & both W/H are set
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset processed images if files change
    setProcessedImages([]);
    setCurrentImageIndex(0);
    setError('');
    if (files.length > 0) {
      const imagePromises = files.map(file => {
        return new Promise<ResizedImage>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              resolve({
                originalName: file.name,
                originalType: file.type,
                originalUrl: e.target?.result as string,
                width: img.width,
                height: img.height,
              });
            };
            img.onerror = () => {
              resolve({
                originalName: file.name,
                originalType: file.type,
                originalUrl: '', // or a placeholder error image URL
                width: 0,
                height: 0,
                error: 'Could not load image metadata.',
              });
            };
            img.src = e.target?.result as string;
          };
          reader.onerror = () => {
            resolve({
              originalName: file.name,
              originalType: file.type,
              originalUrl: '',
              width: 0,
              height: 0,
              error: 'Could not read file.',
            });
          };
          reader.readAsDataURL(file);
        });
      });
      Promise.all(imagePromises).then(setProcessedImages);
    } else {
        // Clear error if all files are removed
        setError('');
    }
  }, [files]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
      if (imageFiles.length !== selectedFiles.length) {
        setError('Some selected files were not images and have been ignored.');
      } else {
        setError(''); // Clear error if all are images
      }
      setFiles(imageFiles);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const selectedFiles = Array.from(event.dataTransfer.files);
      const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
       if (imageFiles.length !== selectedFiles.length) {
        setError('Some dropped files were not images and have been ignored.');
      } else {
        setError('');
      }
      setFiles(prevFiles => [...prevFiles, ...imageFiles].filter((file, index, self) => 
        index === self.findIndex((f) => f.name === file.name && f.lastModified === file.lastModified)
      )); // Basic de-duplication
      event.dataTransfer.clearData();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const removeFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setProcessedImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    if (currentImageIndex >= files.length - 1 && files.length > 1) {
      setCurrentImageIndex(files.length - 2);
    } else if (files.length === 1) {
        setCurrentImageIndex(0);
        // Reset file input to allow re-uploading the same file if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  };

  const handleResizeAndDownload = async () => {
    if (processedImages.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    if (!targetWidth && !targetHeight) {
      setError('Please provide either a target width or height for resizing.');
      return;
    }
    setError(''); // Clear previous global errors before processing
    setIsLoading(true);

    const imagesToProcess = [...processedImages]; // Work on a copy
    const newProcessedImages: ResizedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const imageInfo = imagesToProcess[i];
      const image = new Image();
      image.src = imageInfo.originalUrl;

      const resizedResult = await new Promise<ResizedImage>(resolve => {
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ ...imageInfo, error: 'Could not get canvas context.', resizedUrl: undefined });
            return;
          }

          let newWidth = image.width;
          let newHeight = image.height;
          const w = parseInt(targetWidth);
          const h = parseInt(targetHeight);

          if (keepAspectRatio) {
            if (w && h && allowCrop) {
              const originalAspectRatio = image.width / image.height;
              const targetAspectRatio = w / h;
              let sourceX = 0, sourceY = 0, sourceWidth = image.width, sourceHeight = image.height;

              if (originalAspectRatio > targetAspectRatio) {
                sourceWidth = image.height * targetAspectRatio;
                sourceX = (image.width - sourceWidth) / 2;
              } else if (originalAspectRatio < targetAspectRatio) {
                sourceHeight = image.width / targetAspectRatio;
                sourceY = (image.height - sourceHeight) / 2;
              }
              canvas.width = w;
              canvas.height = h;
              ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, w, h);
              newWidth = w; 
              newHeight = h; 
            } else if (w && h) { // Both provided, keep aspect, no crop (fit within)
                const originalAspectRatio = image.width / image.height;
                if (w / h > originalAspectRatio) { // Target is wider than original ratio, so height is limiting
                    newHeight = h;
                    newWidth = Math.round(h * originalAspectRatio);
                } else { // Target is narrower or same, so width is limiting
                    newWidth = w;
                    newHeight = Math.round(w / originalAspectRatio);
                }
            } else if (w) {
              newWidth = w;
              newHeight = Math.round((image.height / image.width) * w);
            } else if (h) {
              newHeight = h;
              newWidth = Math.round((image.width / image.height) * h);
            }
          } else { // Don't keep aspect ratio
            if (w) newWidth = w;
            if (h) newHeight = h; // If only one is provided, it uses original for the other
          }
          
          // Ensure canvas dimensions are positive integers
          canvas.width = Math.max(1, Math.round(newWidth));
          canvas.height = Math.max(1, Math.round(newHeight));
          
          // For 'fit within' or single dimension resize when aspect ratio is kept (and not cropping)
          if (!(w && h && keepAspectRatio && allowCrop)) {
             ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          }
          
          const outputType = imageInfo.originalType === 'image/jpeg' ? 'image/jpeg' : 'image/png';
          const quality = outputType === 'image/jpeg' ? 0.9 : undefined;

          resolve({ 
            ...imageInfo, 
            resizedUrl: canvas.toDataURL(outputType, quality),
            width: canvas.width,
            height: canvas.height,
            error: undefined
          });
        };
        image.onerror = () => {
          resolve({ ...imageInfo, error: 'Could not load image for resizing.', resizedUrl: undefined });
        };
      });
      newProcessedImages.push(resizedResult);
    }
    setProcessedImages(newProcessedImages);
    setIsLoading(false);

    const successfullyResized = newProcessedImages.filter(img => img.resizedUrl && !img.error);
    if (successfullyResized.length > 0) {
      handleDownloadAction(successfullyResized);
    } else if (newProcessedImages.some(img => img.error)){
        setError("Some images could not be resized. Check individual image errors (shown on preview).");
    } else if (!targetWidth && !targetHeight) {
        // This case is already handled at the beginning of the function.
    } else {
        setError("No images were successfully resized. Please check settings or try different images.");
    }
  };

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAction = async (resizedImages: ResizedImage[]) => {
    if (resizedImages.length === 0) return;

    if (resizedImages.length === 1) {
      const imageToDownload = resizedImages[0];
      if (imageToDownload && imageToDownload.resizedUrl) {
        const originalExtension = imageToDownload.originalName.split('.').pop();
        const outputExtension = imageToDownload.originalType === 'image/jpeg' ? 'jpeg' : 'png';
        const baseName = imageToDownload.originalName.substring(0, imageToDownload.originalName.length - (originalExtension?.length || 0) -1);
        downloadImage(imageToDownload.resizedUrl, `${baseName}_resized.${outputExtension}`);
      } else {
        setError("Resized image is not available for download.");
      }
    } else {
      try {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        let resizedCount = 0;

        resizedImages.forEach(img => {
          if (img.resizedUrl) {
            const base64Data = img.resizedUrl.split(',')[1];
            const originalExtension = img.originalName.split('.').pop();
            const outputExtension = img.originalType === 'image/jpeg' ? 'jpeg' : 'png';
            const baseName = img.originalName.substring(0, img.originalName.length - (originalExtension?.length || 0) -1);
            zip.file(`${baseName}_resized.${outputExtension}`, base64Data, { base64: true });
            resizedCount++;
          }
        });

        if (resizedCount === 0) {
          setError("No resized images available to include in the ZIP.");
          return;
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'resized_images.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (err) {
        console.error("Error generating ZIP: ", err);
        setError("Failed to generate ZIP file. Make sure JSZip is correctly installed and imported.");
      }
    }
  };

  const currentProcessedImage = processedImages[currentImageIndex];
  const resizeButtonText = () => {
    if (isLoading) return 'Processing...';
    if (files.length === 0) return 'Resize Image(s)'; 
    if (files.length === 1 && processedImages.some(p => p.resizedUrl)) return 'Download Resized Image';
    if (files.length > 1 && processedImages.some(p => p.resizedUrl)) return 'Download Resized Images (ZIP)';
    if (files.length === 1) return 'Resize & Download Image';
    return 'Resize & Download ZIP';
  };

  const getHelperTextForDimensions = () => {
    if (keepAspectRatio) {
        return "With 'Keep aspect ratio': Enter width OR height; the other is auto-calculated. If both are entered, image fits within these dimensions (and will be cropped if 'Crop to fit' is also checked below).";
    } else {
        return "Without 'Keep aspect ratio': Image will be stretched/squashed to specified width and/or height. If only one dimension is provided, the other remains original.";
    }
  };

  return (
    <ToolLayout
      title="Image Resizer"
      description="Upload, resize, and crop your images with ease. Download single images or a batch as a ZIP."
    >
      <div className={`grid gap-6 ${files.length > 0 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
        {/* Controls Column */}
        <div className={`${files.length > 0 ? 'md:col-span-1' : 'col-span-1'} space-y-6`}>
          {files.length === 0 && (
            <div 
              className="border-2 border-dashed border-muted-foreground/50 p-6 rounded-lg text-center cursor-pointer hover:border-primary transition-colors min-h-[150px] flex flex-col justify-center items-center"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag & drop images here, or click to select files.
              </p>
            </div>
          )}

          {error && files.length === 0 && ( // Only show global error here if no files, otherwise it might be confusing
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {files.length > 0 && (
            <>
              {error && ( // Show error above settings if files are present
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Resize Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width (px)</Label>
                    <Input 
                      id="width" 
                      type="number" 
                      placeholder="e.g., 1920" 
                      value={targetWidth}
                      onChange={(e) => setTargetWidth(e.target.value)}
                      min="1"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (px)</Label>
                    <Input 
                      id="height" 
                      type="number" 
                      placeholder="e.g., 1080" 
                      value={targetHeight}
                      onChange={(e) => setTargetHeight(e.target.value)}
                      min="1"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1 px-1">
                    {getHelperTextForDimensions()}
                </p>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="aspectRatio" 
                    checked={keepAspectRatio}
                    onCheckedChange={(checked: boolean | 'indeterminate') => setKeepAspectRatio(Boolean(checked))}
                    disabled={isLoading}
                  />
                  <Label htmlFor="aspectRatio" className="cursor-pointer">Keep aspect ratio</Label>
                </div>
                {keepAspectRatio && targetWidth && targetHeight && (
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox 
                      id="allowCrop" 
                      checked={allowCrop}
                      onCheckedChange={(checked: boolean | 'indeterminate') => setAllowCrop(Boolean(checked))}
                      disabled={isLoading || !targetWidth || !targetHeight}
                    />
                    <Label htmlFor="allowCrop" className="cursor-pointer">Crop to fit exact dimensions</Label>
                  </div>
                )}
              </div>
            
              <Button onClick={handleResizeAndDownload} disabled={isLoading || (!targetWidth && !targetHeight)} className="w-full">
                {resizeButtonText()}
                <Settings2 className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Image Preview & List Column - Only renders if files.length > 0 */}
        {files.length > 0 && (
          <div className="md:col-span-2 space-y-6">
            {processedImages.length > 0 && currentProcessedImage ? (
              <div className="space-y-4">
                {/* This area consistently shows a dropzone for adding more images. */}
                {/* No other preview elements or status messages will be shown directly in this block. */}
                <div 
                  className="border-2 border-dashed border-muted-foreground/50 p-6 rounded-lg text-center cursor-pointer hover:border-primary transition-colors min-h-[200px] flex flex-col justify-center items-center aspect-video bg-muted"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                >
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag & drop more images, or click to select.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Resize settings will apply to all images.
                  </p>
                </div>
                
                {/* Status messages previously here have been removed as per user request */}
                {/* They are still available in the thumbnail list below */}
              </div>
            ) : (
                // This shows when files are uploaded, but processedImages isn't populated yet (e.g. during initial load of files)
                // or if no files are uploaded yet but this column is rendered.
                <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-muted-foreground/20 rounded-lg p-10 text-center min-h-[300px]">
                    <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-4 animate-pulse" />
                    <p className="text-muted-foreground">Loading image previews...</p>
                </div>
            )}
            
            {processedImages.length > 0 && (
              <div>
                <h4 className="text-md font-semibold mb-2">Uploaded Images ({files.length})</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                  {processedImages.map((img, index) => (
                    <div 
                      key={`${img.originalName}-${index}-${img.originalUrl?.length || 0}` } 
                      className={`relative aspect-square border rounded-md overflow-hidden cursor-pointer ${index === currentImageIndex ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-1 hover:ring-primary/50'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !isLoading && setCurrentImageIndex(index)}
                    >
                      <img 
                          src={img.originalUrl} 
                          alt={img.originalName} 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')}
                      />
                      {!isLoading && (
                        <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                        className="absolute top-1 right-1 bg-destructive/80 hover:bg-destructive text-destructive-foreground p-1 rounded-full shadow-md transition-opacity duration-150 ease-in-out opacity-75 hover:opacity-100"
                        title="Remove image"
                        >
                        <X className="h-3 w-3" />
                        </button>
                      )}
                      {img.resizedUrl && !img.error && <div className="absolute bottom-1 right-1 bg-green-500/80 p-0.5 rounded-full shadow-md" title="Resized Successfully"><Download className="h-2.5 w-2.5 text-white"/></div>}
                      {img.error && <div className="absolute bottom-1 left-1 bg-red-500/80 p-0.5 rounded-full shadow-md" title={`Error: ${img.error}`}><X className="h-2.5 w-2.5 text-white"/></div>}
                      {!img.resizedUrl && !img.error && <div className="absolute bottom-1 right-1 bg-blue-500/80 p-0.5 rounded-full shadow-md" title="Pending Resize"><Settings2 className="h-2.5 w-2.5 text-white"/></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default ImageResizeTool;
