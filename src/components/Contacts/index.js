import React from 'react';
import defaultAvatar from '~/assets/defaultAvatar.png';
// -----------------------------------------------------------------------------

import {
  BodyView, BodyWrapper,
  Container,
  DatesAndButtonView,
  LeftContactView,
  MarginView02, MarginView04, MarginView08,
  TextBio, TextPoints, TitleView, TitleText,
  UserImage, WorkerImageBackground,
} from '../Tasks/styles';


export default function Contacts({ navigation, data }) {
const taskConditionIndex = 1;

  function handleWorkerPage() {
    navigation.navigate('WorkerPage', {
      id: data.id,
      worker_name: data.worker_name,
      email: data.email,

      first_name: data.first_name,
      last_name: data.last_name,
      department: data.department,
      points: data.points,
      instagram: data.instagram,
      linkedin: data.linkedin,
      bio: data.bio,
      avatar: data.avatar,
      blocked_list: data.blocked_list,
      flagged_list: data.flagged_list,
    })
  }

  // ---------------------------------------------------------------------------
  return (
    <Container taskConditionIndex={taskConditionIndex} onPress={handleWorkerPage}>
      <LeftContactView>
        { data === undefined || data.avatar === null
          ? (
            <WorkerImageBackground>
              <UserImage source={defaultAvatar}/>
            </WorkerImageBackground>

          )
          : (
            <WorkerImageBackground>
              <UserImage source={{ uri: data.avatar.url }}/>
            </WorkerImageBackground>
          )
        }
      </LeftContactView>

      <BodyView>
        <BodyWrapper>
        <MarginView04/>
          <TitleView>
            {
              data.worker_name
              ? (
                <TitleText>{data.worker_name}</TitleText>
              )
              : (
                <TitleText>{data.user_name}</TitleText>
              )
            }
            <TextPoints>({data.points})</TextPoints>
          </TitleView>
          <MarginView02/>
          <DatesAndButtonView>

            {
              data.first_name && data.last_name
              ? (
                <TextBio
                  numberOfLines={1}
                >
                {data.first_name} {data.last_name}
                </TextBio>
              )
              : (
                <TextBio
                  numberOfLines={1}
                >
                -
                </TextBio>
              )
            }
          </DatesAndButtonView>
          <MarginView02/>
          <DatesAndButtonView>


          { data.bio
            ? (
              <TextBio
                numberOfLines={1}
              >
                {data.bio}
              </TextBio>
            )
            : (
              <TextBio
                numberOfLines={1}
              >
                -
              </TextBio>
            )
          }
          </DatesAndButtonView>
          <MarginView04/>
        </BodyWrapper>
      </BodyView>

    </Container>
  )
}
