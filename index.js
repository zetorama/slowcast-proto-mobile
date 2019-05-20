
import {AppRegistry} from 'react-native'
import {name as appName} from './app.json'
import App from './src/app'
import bootstrap from './src/bootstrap'

AppRegistry.registerComponent(appName, () => App)
bootstrap()
