import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  Button,
  TouchableOpacity,
} from "react-native";

interface CustomTimePickerProps {
  isVisible: boolean;
  onClose: () => void;
  value: Date;
  onChange: (date: Date) => void;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  isVisible,
  onClose,
  value,
  onChange,
}) => {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [isAM, setIsAM] = useState(true);

  useEffect(() => {
    const date = new Date(value);
    let h = date.getHours();
    const m = date.getMinutes();

    const am = h < 12;
    setIsAM(am);

    if (h === 0) {
      h = 12; // Midnight case
    } else if (h > 12) {
      h -= 12;
    }

    setHour(h.toString());
    setMinute(m.toString().padStart(2, "0"));
  }, [value]);

  const handleHourChange = (text: string) => {
    const num = parseInt(text, 10);
    if (text === "" || (num >= 1 && num <= 12)) {
      setHour(text);
    }
  };

  const handleMinuteChange = (text: string) => {
    const num = parseInt(text, 10);
    if (text === "" || (num >= 0 && num <= 59)) {
      setMinute(text);
    }
  };

  const handleDone = () => {
    let h = parseInt(hour, 10) || 0;
    const m = parseInt(minute, 10) || 0;

    if (!isAM && h !== 12) {
      h += 12;
    }
    if (isAM && h === 12) {
      h = 0; // Midnight case
    }

    const newDate = new Date(value);
    newDate.setHours(h, m);
    onChange(newDate);
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <Text style={styles.title}>Select Time</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.input}
              value={hour}
              onChangeText={handleHourChange}
              keyboardType="number-pad"
              maxLength={2}
            />
            <Text style={styles.separator}>:</Text>
            <TextInput
              style={styles.input}
              value={minute}
              onChangeText={handleMinuteChange}
              keyboardType="number-pad"
              maxLength={2}
            />
            <TouchableOpacity
              onPress={() => setIsAM(!isAM)}
              style={styles.ampmButton}
            >
              <Text style={styles.ampmText}>{isAM ? "AM" : "PM"}</Text>
            </TouchableOpacity>
          </View>
          <Button title="Done" onPress={handleDone} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 24,
    width: 60,
    textAlign: "center",
  },
  separator: {
    fontSize: 24,
    marginHorizontal: 10,
  },
  ampmButton: {
    marginLeft: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  ampmText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomTimePicker;
