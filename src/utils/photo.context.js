import React, { createContext, useContext, useState } from 'react';

const PhotoContext = createContext();

export const PhotoProvider = ({ children }) => {
  const [tempImages, setTempImages] = useState([]);

  const addPhoto = (photo) => {
    setTempImages((prevPhotos) => [...prevPhotos, photo]);
  };

  const clearPhotos = () => {
    setTempImages([]);
  };

  return (
    <PhotoContext.Provider value={{ tempImages, addPhoto, clearPhotos }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotoContext = () => {
  return useContext(PhotoContext);
};
