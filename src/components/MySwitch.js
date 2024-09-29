import React from "react";
import { Switch, StyleSheet } from "react-native";

const MySwitch = ({ value, onSwitchValueChange }) => {

    const updateSwitchValue = (newValue) => {
        onSwitchValueChange(newValue);
    };

    return (
        <Switch
            value={value ? true : false}
            thumbColor={value ? "#3F51B5" : "#FFF"}
            trackColor={{ true: "rgba(63,81,181,0.6)", false: "#9E9E9E" }}
            onValueChange={updateSwitchValue}
            style={styles.switch}
        />
    );
};

const styles = StyleSheet.create({
    switch: {
        marginRight: 10,
    }
});

export default MySwitch;
