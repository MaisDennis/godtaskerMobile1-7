import styled from 'styled-components/native';
import { TouchableOpacity, TextInput, Text, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import Button from '~/components/Button';
import { RectButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather'

const primaryFont = 'OpenSans-Bold';
const secondaryFont = 'OpenSans-Regular';

export const AlignView = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 0 24px;
  /* background-color: #f5f5f5; */
`;

export const BackIcon = styled(Icon)`
  padding: ${Platform.OS === 'ios' ? '0' : '0 4px'};
  color: #18A0FB;
  /* background-color: #f00; */
`;

export const BackText = styled.Text`
  font-family: ${Platform.OS === 'ios' ? 'system font' : primaryFont};
  /* font-weight: bold; */
  font-size: ${Platform.OS === 'ios' ? '14px' : '12px'};
  margin: 0 auto;
  color: #18A0FB;
  /* background-color: #f00; */
`;

export const ButtonForModal = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: auto;
  /* background-color: #f33; */
`;

export const ButtonWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  /* padding: 16px 16px 8px;
  border-width: 2px;
  border-radius: 4px;
  border-color: #eee; */
  /* background-color: #43e; */
`;


export const Container = styled.SafeAreaView`
  height: 100%;
  background-color: ${Platform.OS === 'ios' ? '#ddd' : '#f5f5f5'};
`;

export const DownloadText = styled.Text`
  font-family: ${Platform.OS === 'ios' ? 'system font' : secondaryFont};
  font-size: ${Platform.OS === 'ios' ? '16px' : '14px'};
  text-align: center;
  /* background-color: #666; */
`;

export const DownloadView = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  padding: 16px 16px 8px;
  border-width: 2px;
  border-radius: 4px;
  border-color: #eee;
  /* background-color: #43e; */
`;

export const FormScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {
    alignItems: 'center',
  },
})`
  width: 100%;
  border-radius: 8px;
  background-color: #fff;
  /* background-color: #f5f; */
`;

export const HrLine = styled.View`
  width: 100%;
  border-width: 0.5px;
  border-color: #ddd;
  margin: 0px auto;
`;

export const ItemWrapperView = styled.View`
  width: 80%;
  height: auto;
  /* background-color: #3ee; */
`;

export const LabelText = styled.Text`
  font-weight: bold;
  font-size: ${Platform.OS === 'ios' ? '14px' : '12px'};
  font-family: ${Platform.OS === 'ios' ? 'system font' : secondaryFont};
  margin-right: 8px;
  color: #1B2432;
`;

export const MarginView02 = styled.View`
  width: 100%;
  margin: 2px 0;
`;

export const MarginView04 = styled.View`
  width: 100%;
  margin: 4px 0;
`;

export const MarginView08 = styled.View`
  width: 100%;
  margin: 8px 0;
`;

export const ModalTitleText = styled.Text`
  font-family: ${Platform.OS === 'ios' ? 'system font' : primaryFont};
  /* font-weight: bold; */
  font-size: ${Platform.OS === 'ios' ? '16px' : '14px'};
  width: 90%;
  text-align: center;
  margin: 0 auto;
  color: #1B2432;
  /* background-color: #f00; */
`;

export const ModalHeaderCenter = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 20%;
  /* background-color: #999; */
`;

export const ModalHeaderLeft = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 40%;
  /* background-color: #ccc; */
`;

export const ModalHeaderRight = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 40%;
  /* background-color: #666; */
`;

export const ModalHeaderView = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  /* background-color: #999; */
`;

export const ModalView = styled.View`
  display: flex;

  align-items: center;
  width: 90%;
  height: auto;
  border-radius: 8px;
  margin: 0 auto;
  background-color: #fff;
  /* background-color: #f00; */
`;

export const NextIcon = styled(Icon)`
  padding: 0 16px;
  color: #18A0FB;
  /* background-color: #f00; */
`;

export const QRImage = styled.Image`
  height: 240px;
  width: 240px;
  /* border-width: 1px;
  border-color: #eee;
  border-radius: 4px; */
  /* margin: 8px; */
  /* border-radius: 48px; */
  background-color: #f5f5f5;
`;

export const RadioButtonLabel = styled.Text`
  /* width: 90%; */
  font-size: ${Platform.OS === 'ios' ? '15px' : '13px'};
  font-family: ${Platform.OS === 'ios' ? 'system font' : secondaryFont};
`;

export const RadioButtonLabelText = styled.Text`
  max-width: 100%;
  font-weight: bold;
  font-size: ${Platform.OS === 'ios' ? '14px' : '12px'};
  color: #1B2432;
`;

export const RadioButtonOuter = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  border-width: 1px;
  border-color: #ccc;
  /* margin-top: 8px; */
  background-color: #eee;

`;
export const RadioButtonInner0 = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 12px;
  background-color: ${props => props.switch === 'en' ? '#1B2432' : '#eee'};
`;
export const RadioButtonInner1 = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 12px;
  background-color: ${props => props.switch === 'pt' ? '#1B2432' : '#eee'};
`;
export const RadioButtonInner2 = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 12px;
  background-color: ${props => props.switch === 2 ? '#1B2432' : '#eee'};
`;
export const RadioButtonInner3 = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 12px;
  background-color: ${props => props.switch === 3 ? '#1B2432' : '#eee'};
`;
export const RadioButtonInner4 = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 12px;
  background-color: ${props => props.switch === 4 ? '#1B2432' : '#eee'};
`;

export const RadioButtonView = styled.View`
  height: auto;
  /* background-color: #4ee; */
`;

export const RadioButtonTag = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: auto;
  /* background-color: #999; */
`;

export const SubHrView = styled.View`
  height: 0;
  width: 100%;
  margin-left: 20%;
  border-width: 0.5px;
  border-color: #ccc;
`;

export const SettingsImageView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 20%;
  margin: 0;
  /* background-color: #f5f5; */
`;
export const SettingsImage = styled(Icon)`

`;

export const SettingsLink = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 20%;
  height: 100%;
  /* background-color: #e55; */

`;

export const SettingsItemText = styled.Text`
  font-family: ${Platform.OS === 'ios' ? 'system font' : secondaryFont};
  font-size: ${Platform.OS === 'ios' ? '15px' : '13px'};
  width: 60%;

  /* background-color: #ee3; */
`;

export const SettingsMenuView = styled.View`
display: flex;
flex-direction: column;
height: auto;
background-color: #fff;
/* background-color: #4433ee; */
`;
export const SettingsItemView = styled.View`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
height: 48px;

background-color: #fff;
`;
export const SettignsLeftView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 50%;
  /* background-color: #3f3; */
`;
export const SettingsRightView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  width: auto;
  /* background-color: #f00; */
`;
export const SpaceView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto;
  width: 30%;
  background-color: #f5f5f5;
/* background-color: #f5f; */
`;

export const UserProfileView = styled.View`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
/* height: 66px; */
height: 80px;
padding: 0 16px;
background-color: #f5f5f5;
/* background-color: #f00; */
`;
export const UserImage = styled.Image`
  height: 48px;
  width: 48px;
  border-radius: 48px;
  background-color: #fff;
`;
export const UserImageBackgroundView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 52px;
  width: 52px;
  border-radius: 52px;
  border-width: 1px;
  border-color: #999;
  background-color: #fff;
`;
export const UserInfoView = styled.View`
display: flex;
flex-direction: column;
width: 90%;
padding: 0 12px;
/* background-color: #4433ee; */
`;
export const UserText = styled.Text`
  font-family: ${Platform.OS === 'ios' ? 'system font' : primaryFont};
  font-size: ${Platform.OS === 'ios' ? '16px' : '14px'};
  padding: 4px 0;
`;
export const UserAboutText = styled.Text`
  font-family: ${Platform.OS === 'ios' ? 'system font' : secondaryFont};
  font-size: ${Platform.OS === 'ios' ? '14px' : '12px'};
  color: #666;
`;
