import { useRef, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";

type props = {
  onChange: (file: File) => void;
  imageUrl?: string;
};

export default function ImageUploader({ onChange, imageUrl }: props) {
  const [draggingOver, setDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef(null);

  function preventDefaults(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    preventDefaults(e);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      onChange(e.currentTarget.files[0]);
    }
  }

  return (
    <div
      ref={dropRef}
      className={`[IMAGE-UPLOADER] ${
        draggingOver && "border-4 border-cyan-500"
      } group relative h-48 w-36 cursor-pointer rounded border-2 border-dashed`}
      style={{
        backgroundSize: "cover",
        ...(imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}),
      }}
      onDragEnter={() => setDraggingOver(true)}
      onDragLeave={() => setDraggingOver(false)}
      onDrag={preventDefaults}
      onDragStart={preventDefaults}
      onDragEnd={preventDefaults}
      onDragOver={preventDefaults}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      {!imageUrl ? (
        <div className="[IMAGE-UPLOADER-BEFORE-UPLOAD] flex h-full w-full flex-col items-center justify-center transition duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <PhotoIcon className="mb-3 h-6 w-6" />
          <div className="text-sm">Upload thumbnail</div>
        </div>
      ) : (
        <div className="absolute top-0 hidden h-full w-full items-center justify-center hover:flex hover:bg-neutral-800/80">
          Change thumbnail
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
