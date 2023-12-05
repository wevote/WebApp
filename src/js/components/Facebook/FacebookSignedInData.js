// eslint-disable-next-line import/no-cycle
import signInModalGlobalState from '../../common/components/Widgets/signInModalGlobalState';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { oAuthLog } from '../../common/utils/logging';
import facebookApi from '../../utils/facebookApi';

const fbData = {
  connected: false,
  status: '',
  accessToken: '',
  id: '',
  email: '',
  firstName: '',
  middleName: '',
  lastName: '',
  cover: '',
  height: 0,
  isSilhouette: false,
  url: '',
  width: 0,
  signedRequest: 0,
  mergeTwoAccounts: false,
  facebookSaysSignedIn: false,
};

/* eslint-disable camelcase */

export default {
  clearFacebookSignedInData () {
    fbData.connected = false;
    fbData.status = '';
    fbData.accessToken = '';
    fbData.id = '';
    fbData.email = '';
    fbData.firstName = '';
    fbData.middleName = '';
    fbData.lastName = '';
    fbData.height = 0;
    fbData.isSilhouette = false;
    fbData.url = '';
    fbData.width = 0;
    fbData.signedRequest = '';
    fbData.facebookSaysSignedIn = false;
    fbData.mergeTwoAccounts = false;
    oAuthLog('clearFacebookSignedInData, state cleared');
  },

  // Entry point
  setConnectedStatus (saveAuthToServer, doMergeOnServer, hasFacebookAuth, signInFunc) {
    oAuthLog(`Entry to setConnectedStatus  saveAuthToServer: ${saveAuthToServer}, doMergeOnServer: ${doMergeOnServer}, hasFacebookAuth: ${hasFacebookAuth}, signInFunc: ${signInFunc}`);
    let response;
    fbData.t0 = performance.now();
    try {
      if (isWebApp()) {
        facebookApi().getLoginStatus((responseInner) => {
          response = responseInner;
          oAuthLog('setConnectedStatus facebookApi().getLoginStatus response:', response);
          this.setFacebookAuthStatus(response, saveAuthToServer, doMergeOnServer, hasFacebookAuth, signInFunc);
        });
      } else {
        facebookApi().getLoginStatus(true,
          (responseInner) => {
            response = responseInner;
            oAuthLog('setConnectedStatus facebookApi().getLoginStatus response:', response);
            this.setFacebookAuthStatus(response, saveAuthToServer, doMergeOnServer, hasFacebookAuth, signInFunc);
          },
          (responseInner) => {
            response = responseInner;
            oAuthLog('setConnectedStatus facebookApi().getLoginStatus FAILURE response:', response);
          });
      }
    } catch (error) {
      console.log('initializeFacebookSDK facebookApi().getLoginStatus error:', error);
    }
  },

  setFacebookAuthStatus (response, saveAuthToServer, doMergeOnServer, hasFacebookAuth, signInFunc) {
    // console.log('setFacebookAuthStatus response:', response);
    const { authResponse, status } = response;

    if (authResponse) {
      const { accessToken, userID, signedRequest } = authResponse;
      fbData.connected = true;
      fbData.status = status;
      fbData.accessToken = accessToken;
      fbData.id = userID;
      fbData.signedRequest = signedRequest;
      oAuthLog(`setConnectedStatus authResponse has connect data, hasFacebookAuth:${hasFacebookAuth}, saveAuthToServer:${saveAuthToServer}`);

      if (!hasFacebookAuth || saveAuthToServer) {
        oAuthLog('setConnectedStatus authResponse has connect data and voter is NOT signed in on WeVote -- fbData', fbData);
        if (isWebApp()) {
          facebookApi().api(
            '/me?fields=id,email,first_name,middle_name,last_name,cover', (responseName) => {
              // console logging in this callback at this line does not work, but putting a native log line in FacebookConnectPlugin.m at about line 705 after the "// If we have permissions to request" comment will get you the data
              this.setFacebookUserData(responseName, saveAuthToServer, doMergeOnServer, signInFunc);
            },
          );
        } else {
          facebookApi().api(
            '/me?fields=id,email,first_name,middle_name,last_name,cover', ['public_profile', 'email'], (responseName) => {
              // console logging in this callback at this line does not work, but putting a native log line in FacebookConnectPlugin.m at about line 705 after the "// If we have permissions to request" comment will get you the data
              this.setFacebookUserData(responseName, saveAuthToServer, doMergeOnServer, signInFunc);
            },
            (responseName) => {
              oAuthLog('setFacebookAuthStatus facebookApi().getLoginStatus FAILURE response:', responseName);
            },
          );
        }
      } else {
        oAuthLog('setConnectedStatus authResponse has connect data and voter is ALREADY signed in -- fbData', fbData);
      }
    } else {
      oAuthLog('setConnectedStatus authResponse is null, no pre-existing FB auth in browser  -- fbData', fbData);
    }
  },

  setFacebookUserData (response, saveAuthToServer, doMergeOnServer, signInFunc) {
    const { id, email, first_name: firstName, middle_name: middleName, last_name: lastName, cover } = response;
    if (id && id === fbData.id) {
      fbData.email = email;
      fbData.firstName = firstName;
      fbData.middleName = middleName;
      fbData.lastName = lastName;
      fbData.cover = cover;
      fbData.facebookSaysSignedIn = true;

      if (isWebApp()) {
        facebookApi().api(
          '/me?fields=picture.type(large)&redirect=false',
          (responsePhoto) => {
            oAuthLog('setConnectedStatus -> setFacebookUserData -> setFacebookPhotoData response', responsePhoto);
            this.setFacebookPhotoData(responsePhoto, saveAuthToServer, doMergeOnServer, signInFunc);
          },
        );
      } else {
        facebookApi().api(
          '/me?fields=picture.type(large)&redirect=false', ['public_profile', 'email'],
          (responsePhoto) => {
            oAuthLog('setConnectedStatus -> setFacebookUserData -> setFacebookPhotoData response', responsePhoto);
            this.setFacebookPhotoData(responsePhoto, saveAuthToServer, doMergeOnServer, signInFunc);
          },
          (responsePhoto) => {
            oAuthLog('setConnectedStatus -> setFacebookUserData -> setFacebookPhotoData FAILURE response', responsePhoto);
          },
        );
      }
    }
  },

  setFacebookPhotoData (response, saveAuthToServer, doMergeOnServer, signInFunc) {
    const { picture: { data: { height, isSilhouette, url, width } } } = response;
    fbData.height = height;
    fbData.isSilhouette = isSilhouette;
    fbData.url = url;
    fbData.width = width;

    if (saveAuthToServer) {
      this.saveDataToServer(doMergeOnServer, signInFunc);
    }
  },

  saveDataToServer (doMerge, signInFunc) {
    oAuthLog('setConnectedStatus -> setFacebookUserData -> setFacebookPhotoData -> saveDataToServer', fbData);
    fbData.duration = `${Math.trunc(performance.now() - fbData.t0)} ms`;
    delete fbData.t0;
    fbData.mergeTwoAccounts = doMerge;
    signInFunc(fbData);  // This calls a save to the server
  },

  getFacebookSignedInData () {
    return fbData;
  },

  login2022Response (resolve, response) {
    oAuthLog('then for .login() facebookApiLogin2022');
    const { status: fbstatus } = response;
    if (fbstatus === 'connected') {
      oAuthLog('facebookApiLogin2022 login success response: ', response);
      signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
      resolve(true);
    } else {
      // "The person is not logged into your webpage or we are unable to tell."
      oAuthLog('facebookApiLogin2022 login failure response: ', response);
      signInModalGlobalState.set('waitingForFacebookApiCompletion', false);
      resolve(false);
    }
  },

  facebookApiLogin2022 () {
    oAuthLog('entry to facebookApiLogin2022');
    return new Promise((resolve) => {
      if (isWebApp()) {
        facebookApi().login((response) => {
          this.login2022Response(resolve, response);
        });
      } else {
        facebookApi().login(['public_profile', 'email'], (response) => {
          this.login2022Response(resolve, response);
        },
        (responseFail) => {
          console.log('Failure to sign in to Facebook', JSON.stringify(responseFail));
        });
      }
    });
  },
};
