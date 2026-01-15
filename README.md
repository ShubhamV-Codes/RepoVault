#  🚀 RepoVault

- RepoVault is a **GitHub-inspired repository hosting platform** built using the **MERN stack**, with an integrated **CLI tool** that lets you push and fetch code directly from the terminal.  
All repository files are securely stored and served from **AWS S3**.

- Think of RepoVault as a learning-focused GitHub clone with cloud storage and CLI support.

---

## ✨ Features

- 🔐 User authentication (JWT-based)
- 📁 Create and manage repositories
- 📤 Push code directly from terminal using RepoVault CLI
- 📥 Fetch repository files from AWS S3
- ☁️ Secure file storage using AWS S3
- 🧠 RESTful API architecture
- 🌐 Modern React-based frontend
- ⚙️ MERN stack backend (Node.js, Express, MongoDB)

---

## 🧩 Tech Stack

### 🖥️ Frontend
- React
- Axios

### 🗄️ Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- S3 Bucket

### ⌨️ CLI Tool
- Node.js
- Commander / FS modules
- Published on npm as `repovault`

### ☁️ Cloud & DevOps
- AWS S3 (file storage)
- Render / S3 / Amplify
- dotenv for environment variables

---

## RepoVault CLI 

RepoVault CLI is a Git-inspired command-line tool that helps you manage repositories, track file changes, create commits, and sync them with a remote RepoVault server.

---

## ✨ Features

- Initialize a local repository
- Stage files (single, multiple, or all)
- Create commits with messages
- View repository status
- Push commits to a remote repository
- Pull latest files from remote
- Revert to previous commits
- Manage remotes (add, list)
- Login with token-based authentication

---

## 📦 Installation

 Install Node Package Manager(Important):

```bash
npm install repovault
```
Link CLI globally:
```bash 
repovault link
```
Verify installation:
```bash
repovault --help
```
### 🔐 Login
```bash
repovault login
```
### 📁 Initialize Repository
```bash
repovault init
```
### ➕ Stage Files
```bash
repovault add .

```

### 💾 Commit Changes

```bash
repovault commit -m "message"
```
### 📊 Check Status

```bash
repovault status
```

### 🌐 Remote Management

``` bash
repovault remote add origin <url> <name>
```
### ⬆️ Push Commits

```bash
repovault push
```

### ⬇️ Pull Changes

```bash
repovault pull
```

### ⏪ Revert Commit

```bash
repovault revert <commitID>
```
---

# 🛠️ Environment Variables

## 🗄️ Backend(.env)

- PORT=3000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- AWS_ACCESS_KEY_ID=your_aws_access_key
- AWS_SECRET_ACCESS_KEY=your_aws_secret_key
- AWS_BUCKET_NAME=your_s3_bucket_name
- AWS_REGION=your_bucket_region

## 🖥️ Frontend (.env)

- REACT_APP_API_URL=your backend url

---

# ▶️ Running Locally 

## 🔁 Clone Repository

- git clone https://github.com/shubhamv-codes/repovault.git
- cd repovault

## 🗄️ Backend Setup 

- cd backend
- npm install
- node index.js start

## 🖥️ Frontend Setup 

- cd frontend
- npm install
- npm run dev

---

# 🧪 Use Case Example

- Create repository from frontend

- Initialize project locally

- Push code using repovault push

- Files stored in AWS S3

- Access repository and files via web UI

- Pull code anytime from terminal

  ---

# 📈 Future Improvements

- Branch support

- Commit history & diffs

- Issues & pull requests

- Team collaboration

- CI/CD integration
  
 ---

 # 🤝 Contributing

- Contributions are welcome!
- Feel free to fork the repo, open issues, or submit pull requests

 ---

 # 🧑‍💻 Author

Shubham Vishwakarma

If you like this project, ⭐ the repository!
 








****




