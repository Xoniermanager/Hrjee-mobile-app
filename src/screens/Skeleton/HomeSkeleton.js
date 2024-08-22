import React from 'react';
import CardSkeleton from './CardSkeleton';
import BorderRadious from './BorderRadious';
import { View, ScrollView, StyleSheet } from 'react-native';

function HomeSkeleton() {
  const arr = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.headerContainer]}>
          <View style={styles.headerLeft}>
            <BorderRadious height={60} width={60} />
            <View style={styles.headerTextContainer}>
              <CardSkeleton height={30} width={150} />
            </View>
          </View>
          <View style={styles.headerRight}>
            <CardSkeleton height={40} width={40} />
            <View style={styles.headerIconSpacing}>
              <CardSkeleton height={40} width={40} />
            </View>
          </View>
        </View>
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} >
            {arr.map((val, index) => (
              <View key={index} style={styles.cardContainer}>
                <CardSkeleton height={170} width={150} />
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.rowContainer}>
          <CardSkeleton height={40} width={160} />
          <CardSkeleton height={40} width={120} />
        </View>

        <View style={styles.singleCardContainer}>
          <CardSkeleton height={150} width={350} />
        </View>
        <View style={{ marginVertical: 5 }}>
          <CardSkeleton height={40} width={200} />
        </View>
        {arr.map((val, index) => (
          <View key={index} style={styles.singleCardContainer}>
            <CardSkeleton height={90} width={400} />
          </View>
        ))}
      </ScrollView>
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
    marginBottom:5
  },
  singleCardContainer: {
    marginVertical: 2,
    alignSelf: 'center',
  },
});

export default HomeSkeleton;
