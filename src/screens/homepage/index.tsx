// import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { useQuery } from 'react-query';
import { themeHook, userAPIHook } from '../../hooks/reactQuery';
import { Button } from 'primereact/button';
import Icon from '../../components/icon';
import { theme } from '../../utils/theme';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_TYPES, BeautifyError, isValidEmail } from '../../utils';
import { TOAST_DURATION } from '../../utils/constants';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../providers/toastProvider';
import './index.scss';

const Homepage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div className="homepage-screen-wrapper">
      Home
    </div>
  );
};

export default Homepage;
