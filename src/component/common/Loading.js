import React from 'react';
import {Background, LoadingText} from './study/Styles';
import Spinner from '../../assets/images/loading.gif'

const Loading = () => {
    return (
        <Background>
          <LoadingText>Loading...</LoadingText>
          <img src={Spinner} alt="로딩중" width="5%" />
        </Background>
      );
}

export default Loading