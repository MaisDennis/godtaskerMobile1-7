import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Feather';

const primaryFont = 'OpenSans-Bold';
const secondaryFont = 'OpenSans-Regular';

export const Container = styled.View`
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  align-items: center;
  height: 30px;
  /* width: 110px; */
  border-radius: 16px;
  background-color: #fff;
  /* background: #F5F5; */
  border-width: 1px;
  /* border-color: #ccc; */
  border-color: ${props => props.focusColor === 2
    ? props => props.worker === true
      ? '#334466'
      : '#19AE7C'
    : '#ccc'
  };
  margin-right: 8px;
`;

export const Input = styled.Text`
  text-align: center;
  font-size: 14px;
  font-family: ${Platform.OS === 'ios' ? 'system font' : secondaryFont};
  height: 100%;
  width: 32px;
  /* line-height: ${Platform.OS === 'ios' ? '30px' : '14px'}; */
  padding: ${Platform.OS === 'ios' ? '0' : '4px 0'};
  color: #1B2432;
  background: #eee;
`;

export const MinusButton = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 38px;
  /* border-radius: 4px; */
  /* background: #1B2432; */
  /* background: #eee; */
`;
export const PlusButton = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 38px;
  /* border-radius: 4px; */
  /* background: #403F4C; */
  /* background: #1B2432; */
  /* background: #eee; */
`;

export const NumberIcon = styled(Icon)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto;
  width: auto;
  line-height: 30px;
  font-size: 14px;
  font-family: ${Platform.OS === 'ios' ? 'system font' : primaryFont};
  font-weight: bold;
  margin: auto;
  color: #1B2432;
  color:  ${props => props.focusColor === 2
    ? props => props.worker === true
      ? '#334466'
      : '#19AE7C'
    : '#ccc'
  }
/* background: #4433ee; */
`;
