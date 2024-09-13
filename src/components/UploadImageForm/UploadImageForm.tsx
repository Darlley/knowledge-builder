'use client';

import { UploadDropzone } from '@/utils/uploadthing';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from '@nextui-org/react';
import { Check, Save, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { UploadImageFormProps } from './UploadImageForm.types';

export default function UploadImageForm({
  onImageUpload,
}: UploadImageFormProps) {
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
    <Card className="w-full h-full p-4 shadow-none dark:bg-gray-950 border dark:border-gray-900">
      <CardHeader>
        <h3 className="text-lg font-semibold">Mudar imagem</h3>
      </CardHeader>
      <CardBody>
        {imageUrl ? (
          <div className="relative w-max">
            <Image
              src={imageUrl}
              alt="Imagem do site"
              className="w-full size-[200px] object-cover rounded-lg"
            />
              <Button
                isIconOnly
                size="sm"
                color="danger"
                className="absolute top-2 right-2 z-10 flex gap-2"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
          </div>
        ) : (
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            appearance={{
              button: 'bg-primary text-white',
              container:
                'border-2 border-dashed border-gray-300 dark:border-gray-700',
              label: 'text-sm text-gray-500 dark:text-gray-400',
            }}
          />
        )}
      </CardBody>
      <CardFooter className="flex justify-between items-center gap-2">
        <div>
          <Button
            color="primary"
            type="submit"
            endContent={<Save className="stroke-[1.5] size-5" />}
          >
            Salvar alterações
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-right w-full">
          Faça upload de uma imagem para representar o seu site.
        </p>
      </CardFooter>
    </Card>
  );
}
