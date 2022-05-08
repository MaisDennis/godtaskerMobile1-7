import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from '~/assets/defaultAvatar.png';
// -----------------------------------------------------------------------------
import {
  AlignView,
  HeaderContainer, HeaderImage, HeaderImageBackgroundView, HeaderLogo,
  HeaderText,
  RightView,
} from './styles';
import logo from '~/assets/detective/detective_remake.png'

export default function HeaderView({ data }) {
  const profileUserName = useSelector(state => state.user.profile.user_name);
  const profileUserEmail = useSelector(state => state.user.profile.email);

  // console.log(data)
  const header_name = data.userData.email === profileUserEmail
    ? data.workerData.user_name || data.workerData.worker_name
    : data.userData.user_name || data.userData.worker_name

  const avatar = data.userData.email === profileUserEmail
    ? data.workerData.avatar
    : data.userData.avatar
  // ---------------------------------------------------------------------------
  return (
    <AlignView>
      <HeaderContainer>
        { avatar === undefined || avatar === null
          ? (
            <HeaderImageBackgroundView>
              <HeaderImage source={defaultAvatar}/>
            </HeaderImageBackgroundView>
          )
          : (
            <HeaderImageBackgroundView>
              <HeaderImage
                source={{ uri: avatar.url}}
              />
            </HeaderImageBackgroundView>
          )
        }
        <HeaderText>{header_name}</HeaderText>
      </HeaderContainer>
      <RightView>
        <HeaderLogo source={logo}></HeaderLogo>
      </RightView>
    </AlignView>
  )
}

