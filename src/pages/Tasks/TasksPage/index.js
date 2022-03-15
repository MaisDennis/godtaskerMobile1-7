import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import Task from '~/components/Tasks';
import api from '~/services/api';
import HeaderView from '~/components/HeaderView';
import logo from '~/assets/detective/detective_remake.png'
import SearchBar from '~/components/Searchbar'
import {
  AddIcon,
  Container,
  List,
  Header, HeaderImage, HeaderTabView, HeaderTouchable,
  SearchBarTextInput, SpaceView,
  Title, TitleNumber,
  UpperTabView, UpperTabText, UpperTabSelectedView, UpperTabSelectedText, UpperTabSelectedBarView
} from './styles';
// -----------------------------------------------------------------------------
export default function TaskPage({ navigation }) {
  const { t, i18n } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [listState, setListState] = useState(1);
  const [searchInputState, setSearchInputState] = useState('');
  const [taskConditionIndex, setTaskConditionIndex] = useState();

  const workerID = useSelector(state => state.worker.profile.id);
  const update_tasks = useSelector(state => state.task.tasks);
  const formattedDate = fdate =>
  fdate == null
    ? '-'
    : format(fdate, "dd 'de' MMMM',' yyyy", { locale: pt });
  const todayDate = formattedDate(new Date())
  // const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    loadTasks('');
  }, [ update_tasks ]);

  async function loadTasks(nameFilter) {
    setSearchInputState(nameFilter)
    setListState(1);
    let response = await api.get(`tasks/unfinished`, {
      params: { workerID, nameFilter },
    });
    setTasks(response.data);
    setTaskConditionIndex(1);
  }

  async function loadTasksRefresh() {
    setSearchInputState('')
    let nameFilter = '';
    setListState(1);
    setTasks(null)
    let response = await api.get(`tasks/unfinished`, {
      params: { workerID, nameFilter },
    });
    setTasks(response.data);
    setTaskConditionIndex(1);
  }

  async function loadFinished(nameFilter) {
    setSearchInputState(nameFilter)
    setListState(2);
    let response = await api.get(`tasks/finished`, {
      params: { workerID, nameFilter }
    })
    setTasks(response.data);
    setTaskConditionIndex(2);
  }

  async function loadCanceled(nameFilter) {
    setSearchInputState(nameFilter)
    setListState(3);
    let response = await api.get(`tasks/canceled`, {
      params: { workerID, nameFilter }
    })
    setTasks(response.data);
    setTaskConditionIndex(3);
  }
  // -----------------------------------------------------------------------------
  return (
    <Container>
      <Header>
        <SpaceView>
          <HeaderImage
            source={logo}
          />
        </SpaceView>
        { listState === 1
          ? (
            <SearchBar
              onChangeText={(input) => loadTasks(input)}
              returnKeyType={'search'}
              value={searchInputState}
            />
          )
          : null
        }
        { listState === 2
          ? (
            <SearchBar
              onChangeText={(input) => loadFinished(input)}
              returnKeyType={'search'}
              value={searchInputState}
            />
          )
          : null
        }
                { listState === 3
          ? (
            <SearchBar
              onChangeText={(input) => loadCanceled(input)}
              returnKeyType={'search'}
              value={searchInputState}
            />
          )
          : null
        }

        <HeaderTouchable onPress={() => loadTasksRefresh()}>
          <AddIcon name='refresh-cw' size={20}/>
        </HeaderTouchable>
      </Header>
      <HeaderTabView>
        { listState === 1
          ? (
            <UpperTabSelectedView>
              <UpperTabSelectedText>{t('LowerCaseOpen')}</UpperTabSelectedText>
              <UpperTabSelectedBarView/>
            </UpperTabSelectedView>

          )
          : (
            <UpperTabView onPress={() => loadTasks('')}>
              <UpperTabText>{t('LowerCaseOpen')}</UpperTabText>
            </UpperTabView>
          )
        }
        { listState === 2
          ? (
            <UpperTabSelectedView>
              <UpperTabSelectedText>{t('LowerCaseFinished')}</UpperTabSelectedText>
              <UpperTabSelectedBarView/>
            </UpperTabSelectedView>
          )
          : (
            <UpperTabView onPress={() => loadFinished('')}>
              <UpperTabText>{t('LowerCaseFinished')}</UpperTabText>
            </UpperTabView>
          )
        }
        { listState === 3
          ? (
            <UpperTabSelectedView>
              <UpperTabSelectedText>{t('LowerCaseCanceled')}</UpperTabSelectedText>
              <UpperTabSelectedBarView/>
            </UpperTabSelectedView>
          )
          : (
            <UpperTabView onPress={() => loadCanceled('')}>
              <UpperTabText>{t('LowerCaseCanceled')}</UpperTabText>
            </UpperTabView>
          )
        }
      </HeaderTabView>

      { tasks == ''
        ? (
          <Title>{t('NoTasksWith')}</Title>
        )
        : (
          <List
            data={tasks}
            keyExtractor={item => String(item.id)}
            renderItem={({ item, index }) => (
              <>
                {/* <TitleNumber>{index+1}</TitleNumber> */}
                <Task
                  key={item.id}
                  data={item}
                  navigation={navigation}
                  // position={index+1}
                  taskConditionIndex={taskConditionIndex}
                />
              </>
            )}
          />
        )
      }
    </Container>
  );
}
