import styled from 'styled-components/native';

const primaryFont = 'OpenSans-Bold';
const secondaryFont = 'OpenSans-Regular';

export const AlignView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  width: 90%;
  height: 100%;
  background: #fff;
  /* background: #ee3; */
`;

export const HeaderContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* height: 100%; */
  /* background: #F5F5; */
`;

export const HeaderText = styled.Text`
color: #222;
font-size: ${Platform.OS === 'ios' ? '16px' : '14px'};
font-family: ${Platform.OS === 'ios' ? 'system font' : primaryFont};
margin: 0;
/* padding: 2px; */
/* background: #F5F5; */
`;

export const HeaderImage = styled.Image`
height: 20px;
width: 22px;
margin-right: 8px;
/* background: #f00; */
`;
