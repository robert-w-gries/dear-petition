import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PageBase from '../PageBase';
import HelpMarkdown from './help.mdx';
import sectionize from 'remark-sectionize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { Markdown, ExpandableHeader } from './style';
import { MDXProvider } from '@mdx-js/react';

export const HelpPageStyled = styled(PageBase)`
  display: flex;
`;

const HelpPageContent = styled.div`
  width: 75%;
  max-width: 1200px;
  min-width: 400px;
`;

const ExpandableSection = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <section>
      {children.map((child, i) => {
        if (i === 0) {
          return (
            <ExpandableHeader key={i} onClick={() => setIsExpanded((prev) => !prev)}>
              {child}
              <FontAwesomeIcon icon={isExpanded ? faCaretRight : faCaretDown} />
            </ExpandableHeader>
          );
        }
        return isExpanded ? child : null;
      })}
    </section>
  );
};

export default function HelpPage() {
  const [source, setSource] = useState();
  const sectionCount = useRef(0);
  return (
    <HelpPageStyled>
      <HelpPageContent>
        <Markdown>
          <MDXProvider components={{ ExpandableSection }}>
            <HelpMarkdown />
          </MDXProvider>
        </Markdown>
      </HelpPageContent>
    </HelpPageStyled>
  );
}
