import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  LinkWrapper,
  LinksGroup,
  PageBaseStyled,
  PageHeader,
  PageLogo,
  PageContentWrapper,
} from './PageBase.styled';
import { smallerThanTabletLandscape } from '../../styles/media';

import { useAuth } from '../../hooks/useAuth';
import { useLogoutMutation } from '../../service/api';
import { loggedOut } from '../../slices/auth';
import { DEAR_LOGO_HEADER_URL } from '~/src/constants/assetConstants';

const LogoLink = styled(LinkWrapper)`
  border: none;
  padding: 0;
  height: 80px;
  width: 300px;
  margin: 0;
  @media (${smallerThanTabletLandscape}) {
    width: 400px;
    height: auto;
  }
`;

const LogoutLink = styled(LinkWrapper)`
  cursor: pointer;
`;

const PageBaseCentered = styled.div`
  max-width: 1200px;
  width: 100%;
`;

function PageBase({ children, className }: { children: React.ReactNode; className?: string }) {
  const history = useHistory();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  return (
    <PageBaseStyled>
      <PageBaseCentered>
        <PageHeader>
          <LogoLink>
            <Link to="/">
              <PageLogo src={DEAR_LOGO_HEADER_URL.toString()} alt="DEAR logo" />
            </Link>
          </LogoLink>
          <LinksGroup>
            {user && (
              <LinkWrapper>
                <Link to="/">New Petition</Link>
              </LinkWrapper>
            )}
            <LinkWrapper>
              <Link to="/help">Help</Link>
            </LinkWrapper>
            {user?.is_admin ? (
              <LinkWrapper>
                <Link to="/agencies">Agencies</Link>
              </LinkWrapper>
            ) : null}
            {user?.is_admin ? (
              <LinkWrapper>
                <Link to="/users">Users</Link>
              </LinkWrapper>
            ) : null}
            {user?.is_admin ? (
              <LinkWrapper>
                <a href={user.admin_url}>Admin</a>
              </LinkWrapper>
            ) : null}
            <LogoutLink
              onClick={() =>
                logout({}).then(() => {
                  dispatch(loggedOut());
                  history.replace('/login');
                })
              }
            >
              Logout
            </LogoutLink>
          </LinksGroup>
        </PageHeader>
        <PageContentWrapper className={className}>{children}</PageContentWrapper>
      </PageBaseCentered>
    </PageBaseStyled>
  );
}

export default PageBase;
