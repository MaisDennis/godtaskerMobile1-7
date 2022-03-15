import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather'
import { TouchableOpacity } from 'react-native'

const primaryFont = 'OpenSans-Bold';
const secondaryFont = 'OpenSans-Regular';

export const AddIcon = styled(Icon)`
font-weight: 700;
margin: 0 auto;
color: #18A0FB;
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

export const Container = styled.SafeAreaView`
  height: 100%;
  /* background-color: ${Platform.OS === 'ios' ? '#ddd' : '#f5f5f5'}; */
  /* background: #4433ee; */
`;

export const DownloadText = styled.Text`
  font-family: ${Platform.OS === 'ios' ? 'system font' : secondaryFont};
  font-size: ${Platform.OS === 'ios' ? '16px' : '14px'};
  text-align: justify;
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

export const Header = styled.View`
display: flex;
flex-direction: row;
align-items: center;
justify-content: space-between;
height: 42px; /* maintain in px. */
/* width: 100%; */
background-color: #fff;
/* background-color: #f5f; */
`;

export const HeaderImage = styled.Image`
height: 30px;
width: 32px;
margin: 0 16px;
/* background: #f00; */
`;

export const HeaderTabView = styled.View`
display: flex;
flex-direction: row;
justify-content: space-between;
width: 100%;
height: auto;
padding: 4px 0;
background-color: #fff;
/* background-color: #f5f; */
`;

export const HeaderTouchable = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content:  flex-end;
  width: 15%;
  /* background-color: #f5f; */
`;


export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: true,
  contentContainerStyle: { padding: 0, margin: 0 },
})`
  height: 100%;
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

export const SpaceView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto;
  width: 15%;
  /* background-color: #f5f; */
`;

export const Title = styled.Text`
  font-weight: bold;
  font-size: 12px;
  color: #999;
  margin: 12px auto 0;
`;

export const UpperTabSelectedView = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 40%;
  border-radius: 16px;
  margin: 4px auto;
  background-color: #1B2432;
`;
export const UpperTabSelectedText = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #fff;
`;

export const UpperTabView = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 40%;
  /* border-width: 1px; */
  /* border-style: solid; */
  /* border-color: #ccc; */
  /* border-radius: 16px; */
  margin: 0 auto;
  /* background-color: #f5f; */
`;
export const UpperTabText = styled.Text`
  font-size: ${Platform.OS === 'ios' ? '14px' : '12px'};
  font-weight: 700;
  /* color: #1B2432; */
  color: #18A0FB;
`;
