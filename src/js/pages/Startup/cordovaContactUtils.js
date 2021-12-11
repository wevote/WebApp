// https://github.com/EinfachHans/cordova-plugin-contacts-x
// eslint-disable-next-line import/no-extraneous-dependencies
import ContactsX from 'cordova-plugin-contacts-x';
import StartedState from './StartedState';

const getDeviceContacts = async (callBack) => {
  ContactsX.find((deviceContactList) => {
    callBack(deviceContactList);
    StartedState.setImportButtonPressed();
    return deviceContactList;
  }, (error) => {
    console.error('contact find error:', JSON.stringify(error));
  }, {
    fields: {
      phoneNumbers: true,
      emails: true,
    },
  });
};

const requestPermissionContacts = async () => {
  ContactsX.requestPermission((success) => {
    console.log(success);
    getDeviceContacts();
  }, (error) => {
    console.error('requestPermission error:', JSON.stringify(error));
  });
};

// eslint-disable-next-line import/prefer-default-export
export const checkPermissionContacts = async (callBack) => {
  ContactsX.hasPermission((success) => {
    console.log(success);
    if (success?.read === false) {
      requestPermissionContacts(callBack);
    }
    getDeviceContacts(callBack);
  }, (error) => {
    console.error('checkPermission error:', JSON.stringify(error));
    requestPermissionContacts();
  });
};
