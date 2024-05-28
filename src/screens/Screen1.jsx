import React, { useEffect, useState } from "react";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import client from "../../api/client";
import { Ionicons } from "@expo/vector-icons";

export const Screen1 = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const AVATAR_FALLBACK_URL =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-SnDtnoTbs_JJtNW62ALeA4gKPtpCGcQ5CnVEJNNAddxjuLwrbo1c16rExrxYL4xLmIw";

  const fetchUsers = async () => {
    try {
      const response = await client.get("/users");
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleEditUser = (id) => {
    setSelectedUserId(id);
    setModalAction("edit");
    toggleModal();
  };

  const handleDeleteUser = (id) => {
    setSelectedUserId(id);
    setModalAction("delete");
    toggleModal();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.listContainer}>
          {users.map((user) => (
            <View key={user.id} style={styles.userItem}>
              <Image
                source={{
                  uri: user.avatar
                    ? `http://192.168.1.6:3001/uploads/users/${user.avatar}`
                    : AVATAR_FALLBACK_URL,
                }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
              <View style={styles.userContent}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
                <Text>{user.role}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleEditUser(user.id)}>
                  <Ionicons name="create" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteUser(user.id)}>
                  <Ionicons name="trash" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalAction === "edit" && (
              <>
                <Text style={styles.modalTitle}>Editar Usuario</Text>
                <Text style={styles.modalText}>ID Seleccionado: {selectedUserId}</Text>
              </>
            )}
            {modalAction === "delete" && (
              <>
                <Text style={styles.modalTitle}>Eliminar Usuario</Text>
                <Text style={styles.modalText}>ID Seleccionado: {selectedUserId}</Text>
              </>
            )}
            <Button title="Close" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 70,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  userItem: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: "#f8f7f7",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userContent: {
    flexDirection: "column",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    marginBottom: 10,
    fontSize: 18,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
