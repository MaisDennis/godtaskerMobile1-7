import React from 'react'

import { AlignView, HeaderContainer, HeaderText, HeaderImage } from './styles';
import godtaskerFont from '~/assets/detective/godtaskerFontPlainGreySmall.png';
import logo from '~/assets/detective/detective_remake.png'
export default function HeaderView({data}) {
  // console.log(data)

  return (
    <AlignView>
      <HeaderContainer>
      <HeaderImage source={logo}></HeaderImage>
        <HeaderText>{data}</HeaderText>
      </HeaderContainer>

    </AlignView>
  )
}
