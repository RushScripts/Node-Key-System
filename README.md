⸻

🔑 Node Key System

A server-side key system built with Node.js + Express + MongoDB Atlas.
It generates 24-hour unique keys, validates them, auto-removes expired keys, and prevents spam with rate-limiting.

Useful for Roblox, APIs, or any project where temporary access keys are needed.

⸻

✨ Features
	•	Generate unique keys (xxxx-xxxx-xxxx-xxxx)
	•	Keys last 24 hours then expire automatically
	•	Auto-cleanup using MongoDB TTL index
	•	Device-persistent keys in browser (cookies)
	•	Rate-limiting (3s per request)
	•	Endpoints to get, verify, and validate keys
	•	Deployable on Vercel, Render, Railway, or any Node host

⸻

📂 Project Structure

node-key-system/
│ .env
│ package.json
│ server.js
├─ models/
│   └─ Key.js
├─ middleware/
│   └─ rate-limit.js
├─ routes/
│   └─ keys.js
├─ public/
│   ├─ getkey.html
│   ├─ generatekey.html
│   └─ js/
│       ├─ generate.js
│       ├─ validate.js
│       └─ verify.js


⸻

🚀 Setup (Local Development)

1. Clone the repository

git clone https://github.com/YOUR-USERNAME/node-key-system.git
cd node-key-system

2. Install dependencies

npm install

3. Create .env

PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/nodekeysystem?retryWrites=true&w=majority
KEY_COOKIE_NAME=node_key_system_device
RATE_LIMIT_WINDOW_MS=3000

Replace <username>, <password>, and <cluster> with your MongoDB Atlas connection string.

4. Run the project

npm run dev

The server runs on http://localhost:3000

⸻

☁️ Hosting on Vercel
	1.	Push your project to GitHub.
	2.	Go to Vercel, create a new project, and import the repository.
	3.	Add environment variables in Project → Settings → Environment Variables:
	•	MONGODB_URI
	•	KEY_COOKIE_NAME=node_key_system_device
	•	RATE_LIMIT_WINDOW_MS=3000
	4.	Deploy the project.

If you encounter persistent MongoDB connection errors, consider hosting on Render, Railway, or Fly.io, which handle long-lived connections more reliably.

⸻

🌐 Endpoints

GET /api/get-key

Returns or generates a key for the requesting device.

{
  "ok": true,
  "key": "8a62-9438-8027-f7dc",
  "expiresAt": "2025-09-25T11:00:00.000Z"
}

POST /api/verify-key

Body:

{ "key": "xxxx-xxxx-xxxx-xxxx" }

Response:

{ "ok": true, "message": "Key valid" }

GET /api/validate?key=xxxx-xxxx-xxxx-xxxx

Validates a key directly via query string.

{ "ok": true, "message": "Key valid" }


⸻

🖥 Demo Pages
	•	/getkey.html → Generate and copy a key
	•	/generatekey.html → Manually generate key
	•	/js/validate.js?KEY=xxxx → Validate by script

⸻

🏗 How It Works
	1.	A client requests a key.
	2.	The server checks if the device already has one.
	3.	If no key exists, a new one is generated, stored in MongoDB, and tied to the device.
	4.	Keys expire after 24 hours and are automatically removed by MongoDB TTL index.
	5.	Validation and verification endpoints check if a key is valid or expired.
	6.	Rate-limiting prevents multiple requests within 3 seconds.

⸻

📊 Architecture

 Client (Browser / Roblox / API)
        │
        ▼
 HTML Pages / Roblox GUI
        │
        ▼
  Express Server (server.js)
        │
   ┌───────────────────┐
   │ rate-limit.js     │
   │ routes/keys.js    │
   │ models/Key.js     │
   └───────────────────┘
        │
        ▼
   MongoDB Atlas
   - Stores active keys
   - TTL auto-deletes expired keys


⸻

🛠 Troubleshooting

MongoDB Connection Error

Error:

MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster

Fix:
	•	Ensure your current IP is whitelisted in MongoDB Atlas Network Access.
	•	In development, whitelist 0.0.0.0/0 to allow all IPs.
	•	Check your .env MONGODB_URI matches Atlas connection string.

Request Failed in Roblox
	•	Enable HTTP Requests in Roblox Studio → Game Settings → Security.
	•	Ensure your endpoint is HTTPS (https://...).
	•	Roblox does not send cookies, so /api/get-key may issue new keys each call.
	•	If needed, add a Roblox-specific endpoint (e.g. /api/get-key-roblox) that ignores cookies.

Rate-Limit Blocking

If you get blocked after spamming requests, wait 3 seconds before making a new request. The rate-limit is per device.

Keys Not Deleting
	•	Ensure MongoDB TTL index is created on expiresAt field.
	•	In Atlas, check the collection → Indexes → verify TTL index exists.

⸻

📜 License

MIT License – free to use, modify, and distribute.

⸻

👤 Credits

Made by RushDoesProgramming

⸻
