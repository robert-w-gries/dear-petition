import React, { Ref, useEffect, useState } from 'react';
import { DragNDropStyled } from './DragNDrop.styled';

const EXCEED_LIMIT_MSG = 'Maximum file limit exceeded';
const BAD_TYPE_MSG = 'One or more of your files is not the right type';

export type DropResult = {
  warnings: string[];
  errors: string[];
  files: File[];
};

type DragNDropProps = {
  children: React.ReactNode;
  mimeTypes: string[];
  maxFiles: number;
  onDrop: (drop: DropResult) => void;
  onDragEnter?: (e: React.DragEvent<HTMLLabelElement>) => void;
  onDragLeave?: (e: React.DragEvent<HTMLLabelElement>) => void;
};

const DragNDrop = React.forwardRef(
  (
    { children, mimeTypes, maxFiles, onDrop, onDragEnter, onDragLeave }: DragNDropProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const [draggedOver, setDraggedOver] = useState(false);

    useEffect(() => {
      // If user misses drag target, override browser's default behavior
      function cancel(e: DragEvent) {
        e.preventDefault();
      }
      window.addEventListener('dragover', cancel, false);
      window.addEventListener('drop', cancel, false);
      return () => {
        window.removeEventListener('dragover', cancel, false);
        window.removeEventListener('drop', cancel, false);
      };
    }, []);

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDraggedOver(true);
      if (onDragEnter) onDragEnter(e);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setDraggedOver(false);
      if (onDragLeave) onDragLeave(e);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();

      if (!e.dataTransfer) {
        return;
      }

      const { dropEffect, files } = e.dataTransfer;
      if (dropEffect !== 'none') return;

      _handleFiles(files);
    };

    const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e?.target?.files) {
        return;
      }
      _handleFiles(e.target.files);
    };

    const _handleFiles = (files: FileList) => {
      const drop: DropResult = {
        warnings: [],
        errors: [],
        files: [],
      };

      if (files.length > maxFiles) {
        drop.errors.push(EXCEED_LIMIT_MSG);
      } else {
        let badTypes = false;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (mimeTypes && !mimeTypes.includes(file.type)) {
            badTypes = true;
            continue;
          }

          drop.files.push(file);
        }
        if (badTypes) drop.warnings.push(BAD_TYPE_MSG);
      }

      onDrop(drop);
    };

    return (
      <>
        <input
          ref={ref}
          className="w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute z-[-1]"
          type="file"
          name="ciprs_file"
          id="ciprs_file"
          onChange={handleManualUpload}
          accept={mimeTypes.join(',')}
          multiple={!maxFiles || maxFiles > 1}
        />
        <DragNDropStyled
          htmlFor="ciprs_file"
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          draggedOver={draggedOver}
          positionTransition
        >
          {children}
        </DragNDropStyled>
      </>
    );
  }
);

export default DragNDrop;
