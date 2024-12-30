import React from 'react';
import CardSkeleton from './CardSkeleton'
import BorderRadious from './BorderRadious';
import { View, ScrollView, StyleSheet, Dimensions, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

function HomeSkeleton() {
  const arr = [1, 2, 3, 4, 5]
  const arr1 = [1, 2, 3]
  const renderItem = ({ item }) => (
    <ShimmerPlaceHolder
      height={160}
      style={{ marginTop: 20, marginHorizontal: 5, width: 150 }}
      autoRun={true}
    />
  );
  const renderItemRecentLogs = ({ item }) => (
    <ShimmerPlaceHolder
      height={60}
      style={{ width: '100%', marginVertical: 7 }}
      autoRun={true}
    />
  );
  return (
    <View style={{ height: height, padding: 20, backgroundColor: '#e3eefb' }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ShimmerPlaceHolder
            style={{
              height: 60,
              width: 60,
              borderRadius: 50,
              marginRight: 15,
            }}
            autoRun={true}
          />
          <View>
            <ShimmerPlaceHolder
              height={35}
              style={{ width: '70%' }}
              autoRun={true}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ShimmerPlaceHolder
            style={{
              height: 45,
              width: 45,
            }}
            autoRun={true}
          />
          <View>
            <ShimmerPlaceHolder
              style={{
                height: 45,
                width: 45,
                marginLeft: 10
              }}
              autoRun={true}
            />
          </View>
        </View>
      </View>
      <View>
        <FlatList horizontal showsHorizontalScrollIndicator={false}
          data={arr}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()} // Use a unique key for each item
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 20 }}>
        <ShimmerPlaceHolder
          style={{
            height: 40,
            width: 150,
          }}
          autoRun={true}
        />
        <View>
          <ShimmerPlaceHolder
            style={{
              height: 40,
              width: 100,
            }}
            autoRun={true}
          />
        </View>
      </View>
      {/* <View
        style={{
          marginTop: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <ShimmerPlaceHolder
            style={{
              height: 50,
              width: 50,
              borderRadius: 50,
              marginRight: 15,
            }}
            autoRun={true}
          />
          <ShimmerPlaceHolder
            height={20}
            width={60}
            style={{ marginTop: 10 }}
            autoRun={true}
          />
        </View>
        <View>
          <ShimmerPlaceHolder
            style={{
              height: 50,
              width: 50,
              borderRadius: 50,
              marginRight: 15,
            }}
            autoRun={true}
          />
          <ShimmerPlaceHolder
            height={20}
            width={60}
            style={{ marginTop: 10 }}
            autoRun={true}
          />
        </View>
        <View>
          <ShimmerPlaceHolder
            style={{
              height: 50,
              width: 50,
              borderRadius: 50,
              marginRight: 15,
            }}
            autoRun={true}
          />
          <ShimmerPlaceHolder
            height={20}
            width={60}
            style={{ marginTop: 10 }}
            autoRun={true}
          />
        </View>
      </View> */}
      <ShimmerPlaceHolder
        style={{ width: '100%', marginVertical: 15, height: '20%', borderRadius: 20 }}
        autoRun={true}
      />
      <ShimmerPlaceHolder
        style={{
          height: 40,
          width: 150, marginBottom:15
        }}
        autoRun={true}
      />
      <View>
        <FlatList
          data={arr1}
          renderItem={renderItemRecentLogs}
          keyExtractor={(item, index) => index.toString()} // Use a unique key for each item
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIconSpacing: {
    marginLeft: 10,
  },
  horizontalScroll: {
    marginVertical: 10,
  },
  cardContainer: {
    marginHorizontal: 5,
    marginVertical: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  singleCardContainer: {
    marginVertical: 2,
    alignSelf: 'center',
  },
});

export default HomeSkeleton;
