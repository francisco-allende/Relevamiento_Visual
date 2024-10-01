import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';

const showToast = (type, text, visibilityTime) => {
    Toast.show({
        type: type,
        text1: text,
        visibilityTime: visibilityTime
    });
}

export default showToast;