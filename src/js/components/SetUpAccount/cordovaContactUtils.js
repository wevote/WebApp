// https://github.com/EinfachHans/cordova-plugin-contacts-x
// eslint-disable-next-line import/no-extraneous-dependencies
import ContactsX from 'cordova-plugin-contacts-x';


const getDeviceContacts = async (callBack) => {
  ContactsX.find((deviceContactList) => {
    window.contactPermissionIos = 'success';
    callBack(deviceContactList);
    return deviceContactList;
  }, (error) => {
    if (error.error !== 3) {    // suppress spurious error with blank message and number 3, while the system dialog is being displayed
      console.error('contact find error:', JSON.stringify(error));
    }
    if (window.contactPermissionIos === 'ask') {
      window.contactPermissionIos = 'cancelled';
    }
    if (window.contactPermissionIos === undefined) {
      window.contactPermissionIos = 'ask';
    }
  }, {
    fields: {
      phoneNumbers: true,
      emails: true,
    },
  });
};

const requestPermissionContacts = async () => {
  ContactsX.requestPermission((status) => {
    console.log('requestPermissionContacts', JSON.stringify(status));
    getDeviceContacts();
  }, (error) => {
    window.contactPermissionIos = 'wtf';
    console.error('requestPermission error:', JSON.stringify(error));
  });
};

// eslint-disable-next-line import/prefer-default-export
export const checkPermissionContacts = async (callBack) => {
  ContactsX.hasPermission((success) => {
    console.log('checkPermissionContacts Results of hasPermission check:', JSON.stringify(success));
    if (success.read === false) {
      console.log('checkPermissionContacts about to requestPermissionContacts');
      requestPermissionContacts(callBack);
    } else {
      window.contactPermissionIos = 'accepted';
    }
    console.log('checkPermissionContacts about to getDeviceContacts');
    getDeviceContacts(callBack);
  }, (error) => {
    console.error('checkPermission error:', JSON.stringify(error));
    requestPermissionContacts();
  });
};
