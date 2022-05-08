import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather'
import { TouchableOpacity } from 'react-native'

export const BlockSmallService = styled.View`
  /* background-color: #000; */
`;

export const Container = styled(TouchableOpacity)`
display: flex;
flex-direction: column;
justify-content: center;
width: 23%;
height: 60px;
border-radius: 4px;
border-width: 2px;
/* border-color: #D0ECE3; */
border-color: ${props => props.display === true ? '#D4D3FF' : '#D0ECE3'} ;
margin: 0 1%;
margin-bottom: 8px;
padding: 8px 0;
background-color: ${props => props.display === true ? '#D4D3FF' : '#D0ECE3'} ;
`;


export const LabelBoldService = styled.Text`
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  margin: 0 10%;
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
