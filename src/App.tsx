import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import RootNavigator from '@navigation/RootNavigator';
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" />
      <RootNavigator />
    </Provider>
  );
}
