import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather'
import { TouchableOpacity } from 'react-native'

export const BlockSmallService = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* height: 64px; */
  /* background-color: #4ee; */
`;

export const Container = styled(TouchableOpacity)`
display: flex;
flex-direction: column;
justify-content: center;
width: 100%;
min-height: 70px;
border-radius: 4px;
border-width: 2px;
/* border-color: #D0ECE3; */
border-color: ${props => props.display === true ? '#D4D3FF' : '#D0ECE3'} ;
/* margin: 0 1%; */
margin-bottom: 8px;
padding: 8px 0;
background-color: ${props => props.display === true ? '#D4D3FF' : '#D0ECE3'} ;
`;


export const LabelBoldPrice = styled.Text`
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  max-width: 20%;
  margin-right: 8px;
  color: #009966;
  /* background-color: #4433ee; */
`;

export const LabelBoldService = styled.Text`
  font-weight: bold;
  font-size: 12px;
  text-align: left;
  max-width: 80%;
  margin-left: 8px;
  color: ${props => props.display === true ? '#334466' : '#009966'};
  /* background-color: #4433ee; */
`;

export const LabelNormalService = styled.Text`
  font-weight: normal;
  font-size: 12px;
  text-align: left;
  max-width: 80%;
  margin-left: 16px;
  color: ${props => props.display === true ? '#334466' : '#009966'};
  /* background-color: #4433ee; */
`;

export const ModalView = styled.View`
  align-items: center;
  height: auto;
  width: 90%;
  border-radius: 8px;
  margin: 0 auto;
  background-color: #fff;
  /* background-color: #f00; */
`;
