import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import Button from '../../../../reusable/Button';
import useApi from '../../../../../api/useApi';
import resetPassApi from '../../../../../api/login';

const Forms = ({navigation}) => {
  return (
    <ScrollView style={{flex: 1, padding: 15, backgroundColor: 'white'}}>
      <View style={{marginBottom: 50}}>
        <Button
          label={'Acknowledgement'}
          onPress={() => navigation.navigate('Acknowledgement')}
        />
        <Button
          label={'Business Cards Request'}
          onPress={() => navigation.navigate('Business Card Request')}
        />
        {/* <Button
          label={'Clearance Letter'}
          onPress={() => navigation.navigate('Clearance Letter')}
        /> */}
        {/* <Button
          label={'Custody Receiving Form'}
          onPress={() => navigation.navigate('Custody Receiving Form')}
        /> */}
        <Button
          label={'Disposal Report'}
          onPress={() => navigation.navigate('Disposal Listings')}
        />
        <Button
          label={'Effective Date Notice'}
          onPress={() => navigation.navigate('Effective Date Notice')}
        />
        {/* <Button
          label={'End of Service Entitlement Payment'}
          onPress={() =>
            navigation.navigate('End of Service Entitlement Payment')
          }
        /> */}

        <Button
          label={'Acknowledgement of Receiving The Internal Policy'}
          onPress={() =>
            navigation.navigate(
              'Acknowledgement of Receiving The Internal Policy',
            )
          }
        />

        {/* <Button
          label={'IT Service or Equipment Request'}
          onPress={() => navigation.navigate('IT Service or Equipment Request')}
        /> */}
        {/* <Button
          label={'Job Offer'}
          onPress={() => navigation.navigate('Job Offer')}
        /> */}
        <Button
          label={'Loan Request'}
          onPress={() => navigation.navigate('Listings')}
        />
        {/* <Button
          label={'Maintenance Request Form'}
          onPress={() => navigation.navigate('Maintenance Request')}
        /> */}
        {/* <Button
          label={'Moving Assests Approval'}
          onPress={() => navigation.navigate('Moving Assests Approval')}
        /> */}
        <Button
          label={'Payment Request'}
          onPress={() => navigation.navigate('Payment Listings')}
        />
        {/* <Button
          label={'Petty Cash Settlement'}
          onPress={() => navigation.navigate('Petty Cash Settlement')}
        /> */}
        <Button
          label={'Purchase Request'}
          onPress={() => navigation.navigate('Purchase Listings')}
        />
        {/* <Button
          label={'Renewal of Iqamas'}
          onPress={() => navigation.navigate('Renewal of Iqamas')}
        /> */}
        <Button
          label={'Spare Parts Request'}
          onPress={() => navigation.navigate('Accessories Listings')}
        />
        {/* <Button
          label={'Travel Allowance'}
          onPress={() => navigation.navigate('Travel Allowance')}
        /> */}
        {/* <Button
          label={'Vacation Request Form'}
          onPress={() => navigation.navigate('Vacation Request')}
        /> */}
      </View>
    </ScrollView>
  );
};

export default Forms;

const styles = StyleSheet.create({});
