import React from "react";
import CardSkeleton from "./CardSkeleton";
import { View, ScrollView } from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

function UserListSkeleton() {
  const arr = [1, 2, 3, 4, 5]
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {/* <CardSkeleton height={30} width={137} />
        <View style={{ flexDirection: "row", marginRight: 20 }}>
          <CardSkeleton height={30} width={30} />
          <View style={{ marginLeft: 10 }}>
            <CardSkeleton height={30} width={30} />
          </View>
        </View> */}
      </View>


      {arr.map((val, index) => {
        return (
          <View key={index} style={{ marginVertical: 5, width: responsiveWidth(93), borderWidth: 1, borderColor: 'gray', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}>
            <CardSkeleton height={responsiveHeight(13)} width={responsiveWidth(30)} borderRadius={5} />
            <View style={{ marginTop: 5 }}>
              <CardSkeleton height={22} width={responsiveWidth(50)} />
              <View style={{ marginTop: 5 }}>
                <CardSkeleton height={22} width={responsiveWidth(50)} />
              </View>
              <View style={{ marginTop: 5 }}>
                <CardSkeleton height={22} width={responsiveWidth(50)} />
              </View>
              <View style={{ marginTop: 5 }}>
                <CardSkeleton height={22} width={responsiveWidth(50)} />
              </View>
            </View>


          </View>
        )
      })}

    </ScrollView>
  );
}

export default UserListSkeleton;
