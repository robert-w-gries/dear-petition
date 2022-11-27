import cx from 'classnames';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

import { Button } from '~/src/components/elements/Button/Button';
import { Spinner } from '~/src/components/elements/Spinner';
import { Tooltip } from '~/src/components/elements/Tooltip/Tooltip';
import DragNDrop, { DropResult } from '~/src/components/elements/DragNDrop/DragNDrop';
import { useTimer } from '~/src/hooks/useTimeout';
import { useCreateBatchMutation } from '~/src/service/api';

import FilesList from './FilesList/FilesList';
import {
  HomePageStyled,
  HomeContent,
  DnDContent,
  DragErrors,
  DragWarnings,
} from './HomePage.styled';

const ALLOWED_MIME_TYPES = ['application/pdf'];
const MAX_FILES = 8;
const LONG_WAIT_TIMEOUT = 5; // seconds

const FilesInputContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-flow: column;
  align-items: center;
  width: 350px;
`;

const ParserCheckboxWrapper = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  input {
    margin-left: 1rem;
  }
  font-size: 1.75rem;
  color: rgb(68 64 60);
`;

const ExperimentalMessage = styled.div`
  display: flex;
  flex-flow: column;
  gap: 0.5rem;

  padding: 2rem 1.25rem;
  width: 500px;

  p {
    color: rgb(68 64 60);
    font-size: 1.7rem;
  }
`;

function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parserMode, setParserMode] = useState(true);
  const [dragWarnings, setDragWarnings] = useState<string[]>([]);
  const [dragErrors, setDragErrors] = useState<string[]>([]);
  const [files, setFiles] = useState<Set<File>>(new Set());
  const [preparePetitionsError, setPreparePetitionsError] = useState('');
  const history = useHistory();
  const [createBatch, { isLoading }] = useCreateBatchMutation();
  const timer = useTimer();

  const _mergeFileSets = (newFiles: File[]) => {
    const mergedFiles = new Set(files);
    newFiles.forEach((file) => mergedFiles.add(file));
    return mergedFiles;
  };

  const handleDrop = (drop: DropResult) => {
    setDragErrors(drop.errors);
    setDragWarnings(drop.warnings);
    if (files.size + drop.files.length > MAX_FILES) {
      setDragErrors(['Maximum file limit exceeded']);
      return;
    }

    let hasDups = false;
    files.forEach((file) => {
      const dup = drop.files.find((newFile) => newFile.name === file.name);
      if (dup) {
        setDragErrors([`Cannot upload duplicate file "${dup.name}"`]);
        hasDups = true;
      }
    });
    if (!hasDups) setFiles(_mergeFileSets(drop.files));
  };

  const handleRemoveFile = (file: File) => {
    // browser stores a "path" to the last file uploaded on the input.
    // It's necessary to "clear" the inputs value here, but not on drop--
    // the browser just replaces previous files in the case of a drop.
    if (fileInputRef.current) fileInputRef.current.value = '';
    // TODO: It would be great to get this taken care of inside DragNDrop,
    // TODO: but currently DragNDrop has no concept of a FilesList or removing files.
    const copiedSet = new Set(files);
    copiedSet.delete(file);
    setFiles(copiedSet);
  };

  const handlePreparePetitions = async () => {
    setPreparePetitionsError('');
    const filesFormData = new FormData();
    files.forEach((file) => filesFormData.append('files', file));
    filesFormData.append('parser_mode', JSON.stringify(parserMode ? 2 : 1));
    timer.current = setTimeout(() => {
      setPreparePetitionsError(
        'It is taking longer than expected to process the uploaded records. Please wait...'
      );
    }, LONG_WAIT_TIMEOUT * 1000);

    createBatch({ data: filesFormData })
      .unwrap()
      .then((data) => {
        history.push(`/generate/${data.id}`);
      })
      .catch(() => {
        setPreparePetitionsError('Error: Could not process the record(s).');
      });
  };

  const experimentalParserMessage = (
    <ExperimentalMessage>
      <p>CIPRS Record reader mode that can handle records with multi-line offense descriptions.</p>
      <p>
        If your generated petition has incorrect offense names, please try de-selecting this option
        to see if the issue is fixed.
      </p>
    </ExperimentalMessage>
  );

  return (
    <>
      <HomePageStyled>
        <HomeContent>
          <FilesInputContainer>
            <DragNDrop
              ref={fileInputRef}
              mimeTypes={ALLOWED_MIME_TYPES}
              maxFiles={MAX_FILES}
              onDrop={handleDrop}
            >
              <DnDContent>
                <div>
                  <h2>Upload CIPRS Records</h2>
                  <p>up to {MAX_FILES} records</p>
                </div>
                <div>
                  {dragWarnings.length > 0 && (
                    <DragWarnings>
                      {dragWarnings.map((warning) => (
                        <p key={warning}>{warning}</p>
                      ))}
                    </DragWarnings>
                  )}
                  {dragErrors.length > 0 && (
                    <DragErrors>
                      {dragErrors.map((error) => (
                        <p key={error}>{error}</p>
                      ))}
                    </DragErrors>
                  )}
                </div>
              </DnDContent>
            </DragNDrop>
            {files && files.size > 0 && (
              <div className="w-[350px] flex flex-col gap-4">
                <ParserCheckboxWrapper>
                  (Beta) Multi-Line Reader Mode
                  <Tooltip tooltipContent={experimentalParserMessage}>
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </Tooltip>
                  <input
                    type="checkbox"
                    checked={!!parserMode}
                    onChange={() => setParserMode((prev) => !prev)}
                  />
                </ParserCheckboxWrapper>
                <Button
                  className={cx('text-2xl p-1 flex gap-4 justify-center items-center', {
                    'cursor-auto': isLoading,
                  })}
                  onClick={handlePreparePetitions}
                  disabled={isLoading}
                >
                  <span>{isLoading ? 'Preparing...' : 'Prepare Petitions'}</span>
                  <Spinner
                    className={isLoading ? 'visible' : 'hidden'}
                    size="xs"
                    color="text-white"
                  />
                </Button>
                {preparePetitionsError && (
                  <p className="text-red text-lg text-bold">{preparePetitionsError}</p>
                )}
                <FilesList files={files} handleRemoveFile={handleRemoveFile} />
              </div>
            )}
          </FilesInputContainer>
        </HomeContent>
      </HomePageStyled>
    </>
  );
}

export default HomePage;
