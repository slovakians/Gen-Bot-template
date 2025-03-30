---

## **🔥 DarkGEN - Free Generator Bot Template**  
A powerful **Discord Slash Command Generator Bot** using `discord.js v14`. Perfect for **stock-based account generators** like Crunchyroll, Xbox, Steam, and more!  

### **📌 Features**  
✅ **Slash Commands** (Easy to use!)  
✅ **Stock Management** (`/stock`, `/add`, `/create`)  
✅ **Random Account Generation** (`/gen <service>`)  
✅ **DMs Generated Accounts** to Users  
✅ **Easy-to-Setup Config (`config.json`)**  

---

## **📂 Setup Guide**  

### **1️⃣ Install Dependencies**  
Make sure you have **Node.js** installed, then run:  
```bash
npm install
```

### **2️⃣ Configure `config.json`**  
Edit the `config.json` file with your bot token:  
```json
{
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "clientId": "YOUR_BOT_ID",
  "guildId": "YOUR_TEST_SERVER_ID",
}
```

### **3️⃣ Configure The config.jsons**  


### **4️⃣ Start the Bot**  
Launch the bot with:  
```bash
node index.js
```

---

## **🛠 Commands List**  

| Command         | Description                                 | Example Usage |
|----------------|---------------------------------------------|--------------|
| `/help`        | Shows all commands                         | `/help` |
| `/stock`       | View available stock                       | `/stock` |
| `/gen`         | Generate a free account                    | `/gen steam` |
| `/create`      | Create a new service in stock              | `/create name:Steam type:Free` |
| `/add`         | Add an account to an existing service      | `/add service:Steam account:user:pass` |

---

## **📜 How Stock Works**  
Stock is stored as `.txt` files inside the `commands/Stock/` folder.  
- Example: `commands/Stock/steam.txt`  
- One account per line (`email:password`)  

---

## **📡 Hosting Options**  
You can host the bot on:  
- **VPS/Dedicated Server** (Recommended)  
- **Repl.it** (Not ideal for long-term hosting)  
- **Glitch.com** (Might need an uptime bot)  
- **Self-hosting (Local Machine)**  

---

## **📜 License**  
This template is **free to use & modify** but credits are appreciated! 🚀  

---
