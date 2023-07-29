import { Tabs, useRouter } from "expo-router";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import { name as appName } from "../../app.json";

export default function AppLayout() {
  const router = useRouter();
  return (
    <PaperProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "black",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Noah's Art",
            tabBarLabel: "Home",
            // headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="add-task" color={color} />
            ),
            headerRight: ({ pressColor }) => (
              <MaterialIcons
                name="settings"
                color={pressColor}
                size={36}
                onPress={() => router.push("/setting")}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: "Appointments",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="code" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="journal"
          options={{
            title: "Journal",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="code" color={color} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => AppLayout());
