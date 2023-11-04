import React, {Suspense, useEffect} from 'react';
import {Box, ChakraProvider, Heading, Image, Text} from '@chakra-ui/react';
import AppRouter from '../routes';
import {AppProvider} from './AppProvider';
import {defaultTheme} from '../theme/default';
import {CartProvider} from '../Cart/CartProvider';
import '../routes/ProfileComponent/styles.css';
import {URLSearchParams} from 'url';
import {Redirect, useLocation, useRouteMatch} from 'react-router-dom';
import {useRouteAdapter} from '../clientExamAdapters';

if (typeof window === 'undefined') {
  global.URLSearchParams = URLSearchParams;
}

export const App = props => {
  useRouteAdapter();

  // if(location.pathname.startsWith("/exam/start")){
  //   return "exam"
  // }

  return (
    <ChakraProvider theme={defaultTheme}>
      <AppProvider>
        <CartProvider>
          <Suspense fallback={<Box>Loading</Box>}>
            {/* <Box p={10}>
              <Image
                w="100px"
                src={'/logo_red.png'}
                alt="COCO"
                cursor="pointer"
              />
              <Box mt={10}>
                <Heading>Website is under Maintainance</Heading>
              </Box>
            </Box> */}
            <AppRouter />
          </Suspense>
        </CartProvider>
      </AppProvider>
    </ChakraProvider>
  );
};
