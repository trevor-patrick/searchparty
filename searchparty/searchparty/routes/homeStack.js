import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import MapScreen from '../screens/MapScreen';
import CreatePartyScreen from '../screens/CreatePartyScreen';
import ExistingLoginScreen from '../screens/ExistingLoginScreen';

const screens = {
    MapScreen: {
        screen: MapScreen,
        navigationOptions: {
            headerShown: false,
        }
    },
    LoginScreen: {
        screen: LoginScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    
    CreatePartyScreen: {
        screen: CreatePartyScreen,
        navigationOptions: {
            headerShown: false,
        }
    },
    ExistingLoginScreen: {
        screen: ExistingLoginScreen,
        navigationOptions: {
            headerShown: false,
        }
    }
}
const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);