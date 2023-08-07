import { deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import * as React from "react";
import { Alert } from "react-native";
import { Modal, Portal, Text, Button, TextInput } from "react-native-paper";
import { db } from "../utils/firebaseConfig";

const DeleteTaskModal = ({
  deleteSched,
  visible,
  setVisible,
  taskID,
  taskName,
}) => {
  const [deleteLabel, setDeleteLabel] = React.useState("Delete");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const deleteTask = () => {
    // setIsDeleting(true);
    // setDeleteLabel("Deleting task...");
    console.log(taskID, taskName);
    console.log("deleting to sqlite...");

    // deleteDoc(doc(db, "taskToday", taskID))
    //   .then(() => {
    //     setVisible(false);
    //     setIsDeleting(false);
    //     setDeleteLabel("Delete");

    //     Alert.alert("task deleted.");
    //   })
    //   .catch((e) => Alert.alert("Error", e));
    deleteSched(taskID);
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
        <Text>Do you really want to delete this task</Text>

        <Text>Task: {taskName}</Text>

        <Button
          mode="contained-tonal"
          onPress={deleteTask}
          loading={isDeleting}
        >
          {deleteLabel}
        </Button>
      </Modal>
    </Portal>
  );
};

export default DeleteTaskModal;
