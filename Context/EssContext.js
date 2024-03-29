import React, {useState} from 'react';

const EssContext = React.createContext();

const EssProvider = ({children}) => {
  const [user, setuser] = useState();
  const [location, setlocation] = useState();
  const [latitude, setlatitude] = useState();
  const [longitude, setlongitude] = useState();
  const [post_id, setpost_id] = useState();
  const [user_id, setuser_id] = useState();
  const [fcmtoken, setfcmtoken] = useState();
  const [showDrawerHeader, setShowDrawerHeader] = useState(true);
  return (
    <EssContext.Provider
      value={{
        user,
        setuser,
        location,
        setlocation,
        latitude,
        longitude,
        setlatitude,
        setlongitude,
        post_id,
        setpost_id,
        user_id,
        setuser_id,
        fcmtoken,
        setfcmtoken,
        showDrawerHeader,
        setShowDrawerHeader,
      }}>
      {children}
    </EssContext.Provider>
  );
};

export {EssContext, EssProvider};
