import {Navigation, ScreenVisibilityListener} from 'react-native-navigation';

import Phrases from './Phrases';
import Signin from './Signin';

export function registerScreens() {
  Navigation.registerComponent('AlpacaFlashcards.Phrases', () => Phrases);
  Navigation.registerComponent('AlpacaFlashcards.Signin', () => Signin);
}

export function registerScreenVisibilityListener() {
  new ScreenVisibilityListener({
    willAppear: ({screen}) => console.log(`Displaying screen ${screen}`),
    didAppear: ({screen, startTime, endTime, commandType}) => console.log('screenVisibility', `Screen ${screen} displayed in ${endTime - startTime} millis [${commandType}]`),
    willDisappear: ({screen}) => console.log(`Screen will disappear ${screen}`),
    didDisappear: ({screen}) => console.log(`Screen disappeared ${screen}`)
  }).register();
}