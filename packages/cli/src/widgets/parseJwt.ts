function parseJwt(token) {
  try {
    // Split the token into header, payload, and signature
    const base64Url = token.split('.')[1];
    // Replace invalid characters
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decode base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    // Parse as JSON
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// 使用方法
// const token = 'eyJhb...'; // 这是你的 JWT
// const data = parseJwt(token);
// console.log(data);

export default function (args) {
  console.log(parseJwt(args.token));
}
