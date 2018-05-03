import { AuthenticationContext, adalFetch, adal, fetch } from 'react-adal';

const MicrosoftGraph = require("@microsoft/microsoft-graph-client");

var adalConfig = {
  tenant: 'xxxxxxxxxxxxxxxxxxxx',
  clientId: 'xxxxxxxxxxxxxxxxxxxxxx',
  endpoints: {
    'https://graph.microsoft.com': 'https://graph.microsoft.com'
  },
  cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
};

export const authContext = new AuthenticationContext(adalConfig);

export var getInfo = function(){

  var bearerToken = authContext.getCachedToken('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
   
   var test = authContext.bearerToken;

   var opts = {
        headers: {
            'Authorization': 'Bearer ' +  bearerToken
        }
    }

    console.log(bearerToken);

    var isCallback = authContext.isCallback(window.location.hash);
    authContext.handleWindowCallback();

    if (isCallback && !authContext.getLoginError()) {
        window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
    }

    // Check Login Status, Update UI
    var user = authContext.getCachedUser();
    if (user) {
        console.log(user.userName);
       
    } else {
       
    }

  
    var baseEndpoint = 'https://graph.microsoft.com';

    authContext.acquireToken(baseEndpoint, function (error, token) {
      if (error || !token) {
          console.log("No token: " + error);
      }
      else
      {
        console.log("The Woken token " + token);

        var client = MicrosoftGraph.Client.init({
            authProvider: (done) => {
                done(null, token); //first parameter takes an error if you can't get an access token
            }
        });

        client
        .api('/me')
        .get((err, res) => {
            console.log(res); // prints info about authenticated user
        });
      }
    })


}


export const adalApiFetch = (fetch, url, options) =>
  adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);