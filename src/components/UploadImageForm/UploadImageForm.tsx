'use client';

import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Image } from '@nextui-org/react';
import { UploadDropzone } from '@/utils/uploadthing';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { UploadImageFormProps } from './UploadImageForm.types';

export default function UploadImageForm({ onImageUpload }: UploadImageFormProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUploadComplete = (res: { url: string }[]) => {
    setImageUrl(res[0].url);
    onImageUpload(res[0].url);
  };

  const handleUploadError = () => {
    toast.error('Ocorreu um erro ao enviar a imagem');
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    onImageUpload(null);
  };

  return (
    <Card className="w-full p-4 shadow-none dark:bg-gray-950 border dark:border-gray-900">
      <CardHeader>
        <h3 className="text-lg font-semibold">Imagem do Site</h3>
      </CardHeader>
      <CardBody>
        {imageUrl ? (
          <div className="relative w-max">
            <Image
              src={imageUrl}
              alt="Imagem do site"
              className="w-full size-[200px] object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <Button
                isIconOnly
                size="sm"
                color="primary"
                variant='shadow'
                onClick={() => toast.success('Imagem do site atualizada! 🎉')}
              >
                <Check className="w-4 h-4 stroke-white" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>

            </div>
          </div>
        ) : (
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            appearance={{
              button: 'bg-primary text-white',
              container: 'border-2 border-dashed border-gray-300 dark:border-gray-700',
              label: 'text-sm text-gray-500 dark:text-gray-400',
            }}
          />
        )}
      </CardBody>
      <CardFooter>
        <p className="text-xs text-gray-500">
          Faça upload de uma imagem para representar o seu site.
        </p>
      </CardFooter>
    </Card>
  );
}