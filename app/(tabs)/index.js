import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { StatusBar } from "expo-status-bar";
import { Tab, TabView } from "@rneui/themed";
import {
  ActivityIndicator,
  Button,
  FAB,
  List,
  MD3Colors,
  SegmentedButtons,
  Surface,
} from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import MyModal from "../../components/Modal";
import DeleteTaskModal from "../../components/DeleteTaskModal";

const index = () => {
  const router = useRouter();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [fetchingData, setFetchingData] = useState(true);
  const [schedules, setSchedules] = useState([]);

  const [index, setIndex] = useState(0);
  const [value, setValue] = React.useState("today");

  // Modal Add Task states
  const [visible, setVisible] = React.useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  // Delete task modal states
  const [visible2, setvisible2] = useState();
  const [taskIDToDelete, setTaskIDToDelete] = useState();
  const [taskNameToDelete, setTaskNameToDelete] = useState();

  const colRef = collection(db, "taskToday");
  useEffect(() => {
    onSnapshot(colRef, (snap) => {
      setSchedules([]);
      snap.docs.map((doc) => {
        setSchedules((prev) => [...prev, { data: doc.data(), id: doc.id }]);
      });

      setFetchingData(false);
    });

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update the time every second (1000 milliseconds)

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentTime.toDateString();
  const formattedTime = currentTime.toTimeString().slice(0, 8); // Extract the time part only
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <Text style={{ fontSize: 18 }}>Date: {formattedDate}</Text>
        <Text style={{ fontSize: 18 }}>{formattedTime}</Text>
      </View>

      <View
        style={{ display: "flex", alignItems: "center", marginVertical: 10 }}
      >
        <Text style={{ fontSize: 18 }}>You Create Your Reality</Text>
        <Text style={{ fontSize: 26 }}>Create you future now!</Text>
      </View>

      <SegmentedButtons
        style={{ marginHorizontal: 10 }}
        value={value}
        onValueChange={setValue}
        density="regular"
        buttons={[
          {
            value: "today",
            label: "Today",
            // onPress: () => Alert.alert("Sorting Task", "Task today."),
            showSelectedCheck: true,
          },
          {
            value: "tomorrow",
            label: "Tomorrow",
            // onPress: () => Alert.alert("Sorting Task", "Task tomorrow."),
            showSelectedCheck: true,
          },
          {
            value: "soon",
            label: "Soon",
            // onPress: () => Alert.alert("Sorting Task", "Task soon."),
            showSelectedCheck: true,
          },
        ]}
      />
      <View
        style={{
          flex: 1,
        }}
      >
        <ActivityIndicator
          size={"large"}
          animating={fetchingData}
          color={"red"}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginLeft: "-4%",
          }}
        />
        <FlatList
          style={{ padding: 5, marginBottom: 5 }}
          data={schedules}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setTaskIDToDelete(item?.id);
                setTaskNameToDelete(item?.data?.taskName);
                setvisible2(true);
              }}
            >
              <List.Section
                style={{
                  backgroundColor: "cyan",
                  borderStyle: "solid",
                  borderColor: "black",
                  borderWidth: 2,
                }}
              >
                <List.Subheader>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>{item?.data?.taskName}</Text>
                    <Text
                      style={{
                        alignItems: "flex-end",
                        textAlign: "right",
                        marginLeft: 100,
                      }}
                    >
                      {item?.data?.added?.toDate().toLocaleString()}
                    </Text>
                  </View>
                </List.Subheader>

                <List.Item
                  key={item.id}
                  title={item.data.taskDescription}
                  right={() => (
                    <List.Icon color={MD3Colors.tertiary70} icon="folder" />
                  )}
                />
              </List.Section>
            </TouchableOpacity>
          )}
        />
      </View>

      <MyModal
        visible={visible}
        setVisible={setVisible}
        taskName={taskName}
        setTaskName={setTaskName}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
      />

      <DeleteTaskModal
        visible={visible2}
        setVisible={setvisible2}
        taskID={taskIDToDelete}
        taskName={taskNameToDelete}
      />

      <FAB
        size="small"
        style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
        icon="plus"
        onPress={() => setVisible(!visible)}
      />
      {/* </SafeAreaView> */}
    </View>
  );
};

export default index;
