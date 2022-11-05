import { Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/UseAuth';
import { Signin } from '../screens/Signin';
import { AppRoutes } from './app.routes';
export function Routes() {
  const { user } = useAuth();
  return (
    <Box flex={1} bg="gray.900">
      <NavigationContainer>
        {user.name ? <AppRoutes /> : <Signin />}
      </NavigationContainer>
    </Box>
  );
}
