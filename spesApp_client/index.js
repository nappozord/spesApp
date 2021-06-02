import * as React from "react";
import { Provider as PaperProvider, DarkTheme } from "react-native-paper";
import App from "./src/App";
import { registerRootComponent } from "expo";
import { colors } from "./src/Colors";
import { AsyncStorage } from "react-native";
import { products } from "./products";

AsyncStorage.getItem("products").then((res) => {
  if (!res) {
    AsyncStorage.setItem("products", JSON.stringify(products));
  }
});

//AsyncStorage.setItem("products", JSON.stringify(products));

AsyncStorage.getItem("options").then((res) => {
  if (!res) {
    AsyncStorage.setItem(
      "options",
      JSON.stringify({
        weeklySpend: 30,
        weeklyShopping: 3,
      })
    );
  }
});

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(Main);
