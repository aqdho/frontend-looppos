const nextConfig = {
  allowedDevOrigins: [
    "localhost",
    "diligent-handstand-unframed.ngrok-free.dev",
  ],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/:path*",
      },
    ];
  },
};

export default nextConfig;