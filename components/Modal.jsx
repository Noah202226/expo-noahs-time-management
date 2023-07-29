import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import * as React from "react";
import { Alert } from "react-native";
import { Modal, Portal, Text, Button, TextInput } from "react-native-paper";
import { db } from "../utils/firebaseConfig";

import RNDateTimePicker from "@react-native-community/datetimepicker";

const MyModal = ({
  visible,
  setVisible,
  taskName,
  setTaskName,
  taskDescription,
  setTaskDescription,
}) => {
  const [adding, setAdding] = React.useState(false);
  const saveTask = () => {
    setAdding(true);
    console.log("saving to firebase...");

    addDoc(collection(db, "taskToday"), {
      taskName,
      taskDescription,
      added: serverTimestamp(),
    })
      .then(() => {
        setVisible(false);
        setTaskName("");
        setTaskDescription("");
        Alert.alert("Task added.");
        setAdding(false);
      })
      .catch((e) => Alert.alert("Error", e));
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(!visible)}
        contentContainerStyle={{
          backgroundColor: "white",
          height: 300,
          marginHorizontal: 20,
          padding: 10,
        }}
      >
        <Text>Add Task</Text>
        <TextInput
          label="Task"
          value={taskName}
          onChangeText={(text) => setTaskName(text)}
        />
        <TextInput
          label="Description"
          value={taskDescription}
          onChangeText={(text) => setTaskDescription(text)}
        />
        <Button mode="contained-tonal" onPress={saveTask} loading={adding}>
          Save task
        </Button>
      </Modal>
    </Portal>
  );
};

export default MyModal;
