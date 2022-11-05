import { VStack, Icon, useToast, FlatList } from 'native-base';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { PoolCard, PoolProps } from '../components/PoolCard';
import { useFocusEffect } from '@react-navigation/native';
import { EmptyPoolList } from '../components/EmptyPoolList';

export function Pools() {
  const { navigate } = useNavigation();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pools, setPools] = useState<PoolProps[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchPools();
    }, [])
  );

  async function fetchPools() {
    try {
      setIsLoading(true);
      const response = await api.get('/pools');
      setPools(response.data.pools);
    } catch (error) {
      console.log(error);
      toast.show({
        title: 'Desculpe, não foi possivel carregar os bolões',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões"></Header>
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md"></Icon>
          }
          onPress={() => navigate('find')}
        ></Button>
      </VStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  );
}
