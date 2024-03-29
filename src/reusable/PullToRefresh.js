import React, {useState, useCallback} from 'react';
import {ScrollView, RefreshControl} from 'react-native';

const PullToRefresh = ({onRefresh, children, style}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);

  return (
    <ScrollView
      style={style}
      refreshControl={
        <RefreshControl
          title="Pull to refresh"
          tintColor="#000000"
          titleColor="#000000"
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }>
      {children}
    </ScrollView>
  );
};

export default PullToRefresh;
