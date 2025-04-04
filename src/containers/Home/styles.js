import React from 'react';
import styled from 'styled-components';
import loginBackGround from '../../assets/LoginBackground.png';

import BannerHome from '../../assets/Banner-Home.svg';

export const Banner = styled.div`
  background-image: url(${BannerHome});
  background-size: cover;
  background-position: center;
  height: 457px;

  h1 {
    font-family: 'Road Rage', serif;
    font-size: 80px;
    color: ${(props) => props.theme.white};

    position: absolute;
    right: 20%;
    top: 10%;
  }
`;

export const Container = styled.section`
  background:
    linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)),
    url(${loginBackGround});
  height: 557px;
`;
export const Content = styled.div`
  padding-bottom: 70px;
`;
