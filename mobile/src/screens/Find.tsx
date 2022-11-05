import { Heading, useToast, VStack } from 'native-base';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useState } from 'react';
import { api } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export function Find() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPool() {
    try {
      setIsLoading(true);
      if (!code.trim()) {
        return toast.show({
          title: 'Por favor, informe o código',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      await api.post('/pools/join', { code });
      toast.show({
        title: 'Você entrou no bolão com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      });
      navigate('pools');
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      if ((error.response.data.message = 'You alredy joined this pool.')) {
        return toast.show({
          title: 'Desculpe, Você já está nesse bolão',
          placement: 'top',
          bgColor: 'red.500',
        });
      }
      toast.show({
        title: 'Desculpe, bolão não encontrado',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" mb={8} textAlign="center">
          Encontre um bolão através de seu código único
        </Heading>
        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          onChangeText={setCode}
          autoCapitalize="characters"
        />
        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
