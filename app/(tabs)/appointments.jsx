import { View, Text } from "react-native";
import React, { useState } from "react";

// libraries
import { Agenda, Calendar, LocaleConfig } from "react-native-calendars";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Card } from "react-native-paper";

const renderItem = (item) => {
  console.log(item);
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        marginRight: 10,
        marginTop: 18,
        backgroundColor: "red",
      }}
    >
      <Card>
        <Card.Content>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text>{item.name}</Text>
            <Avatar.Text label="J" />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const appointments = () => {
  const [selected, setSelected] = useState("");
  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={{
          "2023-08-01": [
            { name: "item 1 - any js object" },
            {
              name: "item 2 - any js object",
              height: Math.max(50, Math.floor(Math.random() * 150)),
            },
          ],
          "2023-08-02": [
            { name: "item 1 - any js object" },
            { name: "item 2 - any js object" },
          ],
          "2023-08-04": [
            { name: "item 1 - any js object" },
            { name: "item 2 - any js object" },
          ],
          "2023-08-05": [
            { name: "item 1 - any js object" },
            { name: "item 2 - any js object" },
          ],
          "2023-08-06": [
            { name: "item 1 - any js object" },
            { name: "item 2 - any js object" },
          ],
        }}
        renderItem={renderItem}
        // Specify what should be rendered instead of ActivityIndicator
        renderEmptyData={() => {
          return <View />;
        }}
        // Specify your item comparison function for increased performance.
      />
    </View>
  );
};

export default appointments;
