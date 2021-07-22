import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  LinksGroup,
  PageBaseStyled,
  PageHeader,
  PageLogo,
  PageContentWrapper,
} from './PageBase.styled';
import dearLogo from '../../assets/img/DEAR_logo.png';
import { smallerThanTabletLandscape } from '../../styles/media';

import useAuth from '../../hooks/useAuth';
import { useLogoutMutation } from '../../service/api';

const LogoLink = styled(Link)`
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

const LogoutLink = styled(Link)`
  cursor: pointer;
`;

function PageBase({ children, className, ...props }) {
  const history = useHistory();
  const { user } = useAuth();
  const [logout] = useLogoutMutation();

  return (
    <PageBaseStyled {...props}>
      <PageHeader>
        <LogoLink to="/">
          <PageLogo src={dearLogo} alt="DEAR logo" />
        </LogoLink>
        <LinksGroup>
          <Link to="/">New Petition</Link>
          <Link to="/help">Help</Link>
          {user?.admin_url ? <a href={user.admin_url}>Admin</a> : null}
          <LogoutLink to="/" onClick={() => logout().then(() => history.replace('/login'))}>
            Logout
          </LogoutLink>
        </LinksGroup>
      </PageHeader>
      <PageContentWrapper className={className}>{children}</PageContentWrapper>
    </PageBaseStyled>
  );
}

export default PageBase;
