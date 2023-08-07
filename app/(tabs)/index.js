import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";

// Expo Sqlite
import { openDatabase } from "expo-sqlite";
const sqlDB = openDatabase("noahsTime.db");

import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  FAB,
  List,
  MD3Colors,
  SegmentedButtons,
} from "react-native-paper";

// Components
import MyModal from "../../components/Modal";
import DeleteTaskModal from "../../components/DeleteTaskModal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BaseToast } from "react-native-toast-message";
import Toast from "react-native-toast-message";
import { ToastAndroid } from "react-native";

const index = () => {
  const router = useRouter();

  const useForceUpdate = () => {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
  };

  function Items({ done: doneHeading, onPressItem }) {
    const [items, setItems] = useState(null);

    useEffect(() => {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from items where done = ?;`,
          [doneHeading ? 1 : 0],
          (_, { rows: { _array } }) => setItems(_array)
        );
      });
    }, []);

    const heading = doneHeading ? "Completed" : "Todo";

    if (items === null || items.length === 0) {
      return null;
    }

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>{heading}</Text>
        {items.map(({ id, done, value }) => (
          <TouchableOpacity
            key={id}
            onPress={() => onPressItem && onPressItem(id)}
            style={{
              backgroundColor: done ? "#1c9963" : "#fff",
              borderColor: "#000",
              borderWidth: 1,
              padding: 8,
            }}
          >
            <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  const [forceUpdate, forceUpdateId] = useForceUpdate();

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
    // onSnapshot(colRef, (snap) => {
    //   setSchedules([]);
    //   snap.docs.map((doc) => {
    //     setSchedules((prev) => [...prev, { data: doc.data(), id: doc.id }]);
    //   });

    //   setFetchingData(false);
    // });

    // Sqlite
    sqlDB.transaction((tx) => {
      tx.executeSql(
        "create table if not exists schedules (id integer primary key not null, done int, schedName text, schedDetails text);"
      );

      tx.executeSql("select * from schedules", [], (_, { rows }) => {
        console.log(rows._array);
        setSchedules([]);
        setSchedules(rows._array);

        setFetchingData(false);
      });
    });

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update the time every second (1000 milliseconds)

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // Sqlite functions
  const add = (schedName, schedDetails) => {
    // is text empty?
    if (schedName === null || schedName === "") {
      return false;
    }

    sqlDB.transaction(
      (tx) => {
        tx.executeSql(
          "insert into schedules (done, schedName, schedDetails) values (0, ?, ?)",
          [schedName, schedDetails]
        );
        tx.executeSql("select * from schedules", [], (_, { rows }) => {
          console.log(rows._array);
          setSchedules([]);
          setSchedules(rows._array);

          setFetchingData(false);
          setVisible(false);
        });
      },
      (e) => console.log(e),
      () => {
        console.log("adding successful.");

        Toast.show({ type: "success", text1: "Added." });
        ToastAndroid.show("Sched Added", ToastAndroid.LONG, ToastAndroid.TOP);

        setTaskName("");
        setTaskDescription("");
      }
    );
  };

  const deleteSched = (id) => {
    sqlDB.transaction(
      (tx) => {
        tx.executeSql(`delete from schedules where id = ?;`, [id]);
        tx.executeSql("select * from schedules", [], (_, { rows }) => {
          console.log(rows._array);
          setSchedules([]);
          setSchedules(rows._array);
        });
      },
      (e) => console.log("error" + e),
      () => {
        setFetchingData(false);
        setvisible2(false);

        Toast.show({
          type: "success",
          text1: "Toast Message",
          text2: "This is a toast message!",
          position: "bottom",
          visibilityTime: 2000,
          autoHide: true,
        });

        ToastAndroid.show("Sched Deleted", ToastAndroid.LONG, ToastAndroid.TOP);
      }
    );
  };

  // Date formating
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

      {/* Render items */}
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
                setTaskNameToDelete(item?.schedName);
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
                    <Text>{item?.schedName}</Text>
                    {/* <Text
                      style={{
                        alignItems: "flex-end",
                        textAlign: "right",
                        marginLeft: 100,
                      }}
                    >
                      {item?.data?.added?.toDate().toLocaleString()}
                    </Text> */}
                  </View>
                </List.Subheader>

                <List.Item
                  key={item.id}
                  title={item?.schedDetails}
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
        add={add}
        visible={visible}
        setVisible={setVisible}
        taskName={taskName}
        setTaskName={setTaskName}
        taskDescription={taskDescription}
        setTaskDescription={setTaskDescription}
      />

      <DeleteTaskModal
        deleteSched={deleteSched}
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
    </View>
  );
};

export default index;
