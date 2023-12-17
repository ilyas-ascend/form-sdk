export function authHeader(customToken) {
  // return authorization header with jwt token
  let token = customToken || JSON.parse(localStorage.getItem("accessToken"));
  if (token) {
    var allowedOrigins = "*";
    var allow_headers =
      "Referer,Accept,Origin,User-Agent,Content-Type,Authorization";
    return {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json, multipart/form-data",
      "Access-Control-Allow-Origin": allowedOrigins,
      "Access-Control-Allow-Methods": "PUT,GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": allow_headers,
      "WWW-Authenticate": "Basic",
      "Access-Control-Allow-Credentials": true,
    };
  }
}
