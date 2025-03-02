export default function middleware(req, res) {
    const allowedOrigins = [
      "https://potatously.vercel.app",
      "http://localhost:5500"
    ];
    
    const origin = req.headers.get("origin");
    
    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
    }
  }
  