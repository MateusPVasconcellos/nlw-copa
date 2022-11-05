import { useRoute } from '@react-navigation/native';
import { HStack, useToast, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Guesses } from '../components/Guesses';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { PoolProps } from '../components/PoolCard';
import { PoolHeader } from '../components/PoolHeader';
import { api } from '../services/api';

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const toast = useToast();
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses'
  );
  const [poolDetails, setPoolDetails] = useState<PoolProps>({} as PoolProps);

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  async function fetchPoolDetails() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Desculpe, não foi possivel carregar os detalhes',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code,
    });
  }

  if (isLoading) return <Loading />;

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        poolShare={handleCodeShare}
      />
      {poolDetails._count?.participants > 0 ? (
        <VStack flex={1} px={5}>
          <PoolHeader data={poolDetails} />
          <HStack bgColor="gray.700" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>
          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack>
      ) : (
        <VStack>
          <EmptyMyPoolList code={poolDetails.code} />
        </VStack>
      )}
    </VStack>
  );
}
