// const jwt = require("jsonwebtoken");
// const { privateKeyId, serviceEmail } = require("../config").GOOGLE.AUTH;

// module.exports = function makeJWT(api) {
//   const sig = {
//     alg: "RS256",
//     typ: "JWT",
//     kid: privateKeyId
//   };

//   const payload = {
//     iss: serviceEmail,
//     sub: serviceEmail,
//     aud: api,
//     iat: Date.now(),
//     exp: Date.now() + 3600
//   };
// };
