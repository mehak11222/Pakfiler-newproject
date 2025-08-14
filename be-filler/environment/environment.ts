export const environment = {
  apiUrl:  process.env.NEXT_PUBLIC_API_URL || 'https://be-filler-server.onrender.com',
  secretKey: process.env.NEXT_PUBLIC_SECRET_KEY || 'secret',
  ytApi: process.env.NEXT_PUBLIC_YT_API || "",
  pass: process.env.NEXT_PUBLIC_PASSWORD_USER || ""
};  