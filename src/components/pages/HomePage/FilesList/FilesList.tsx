import { FilesListWrapper, FilesListStyled, FilesListItem } from './FilesList.styled';
import { AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CloseButton } from '~/src/components/elements/Button';

function FilesList({
  files,
  handleRemoveFile,
}: {
  files: File[];
  handleRemoveFile: (file: File) => void;
}) {
  return (
    <FilesListWrapper>
      <FilesListStyled>
        {[...files].map((file) => (
          <AnimatePresence key={file.name}>
            <FilesListItem
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-50' }}
              positionTransition
            >
              <p>{file.name}</p>
              <CloseButton onClick={() => handleRemoveFile(file)}>
                <FontAwesomeIcon icon={faTimes} />
              </CloseButton>
            </FilesListItem>
          </AnimatePresence>
        ))}
      </FilesListStyled>
    </FilesListWrapper>
  );
}

export default FilesList;
