const nextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.18.165",
    "diligent-handstand-unframed.ngrok-free.dev",
  ],

  async rewrites() {
  return [
    {
      source: "/api/:path*",
      destination:
        "https://belajar-express-production-52cf.up.railway.app/api/:path*",
    },
  ];
},
};

export default nextConfig;