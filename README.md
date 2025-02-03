# PowerTrack: Smart Management Application for Orders and Inventory  
*Capstone Project Phase A + B | 24-2-R-18*  
*Developed by:* Reema Nasr & Amr Kilany  

---

## 📌 Introduction  
PowerTrack is an **innovative management application** designed to **optimize order processing and inventory tracking** for electrical stores. 
It automates **order fulfillment, real-time stock updates, and reporting**, ensuring businesses operate efficiently, reduce manual errors, and enhance customer satisfaction.  

This application is tailored to address inefficiencies in traditional inventory systems, offering **seamless automation, scalability, and an intuitive user experience.** 
By leveraging **modern technologies** such as **React Native, Flask, and MongoDB**, PowerTrack is **fast, secure, and scalable** for growing businesses.  

---

## 🚀 Key Features  
- ✅ **Automated Order Fulfillment** – Reduces manual work and accelerates order processing.  
- ✅ **Real-Time Inventory Tracking** – Ensures stock levels are always up to date.  
- ✅ **Comprehensive Reporting System** – Provides insights into inventory trends and business performance.  
- ✅ **User-Friendly Interface** – Designed for ease of use and efficiency.  
- ✅ **Scalability & Security** – Handles high traffic and secures data with encryption.  
- ✅ **Multi-Device Accessibility** – Works seamlessly on web and mobile (Android/iOS via Expo).  

---

## 💻 System Requirements  
Before running PowerTrack, ensure the following dependencies are installed:  

- **Development Environment:** Visual Studio Code  
- **Source Code Repository:** [GitHub Repository](https://github.com/amrkal/PowerTrack.git)  
- **Required Software:**  
  - Node.js (v16+)  
  - Expo CLI  
  - npm  
- **Additional Tools:** Git (for cloning the repository)  

---

## 🚀 Installation & Running the Application  

### 1️⃣ Cloning the Repository  
To clone the PowerTrack project from GitHub, run:  
```
git clone https://github.com/amrkal/PowerTrack.git
cd PowerTrack
 ```

### 2️⃣ Running the Backend (Flask API)
Navigate to the backend directory:
```
cd BACKEND
```
Install dependencies:
```
pip install -r requirements.txt
```
Run the Flask server:
```
python run.py
```
### 3️⃣ Configuring the Frontend (Axios Setup)
Before running the frontend, set the correct API base URL in axiosInstance.tsx:
```
const axiosInstance = axios.create({
  baseURL: 'http://10.0.0.6:5000', // Ensure this matches your backend URL
});
```

### 4️⃣ Running the Frontend (React Native with Expo)
Navigate to the frontend directory:
```
cd PowerTrack-new-branch
```
Install dependencies:
```
npm install 
```
Start the application using Expo:
```
npx expo start
```
---

### 🌍 Accessing the Application

🌐 **Web Access:** Open the URL displayed in the terminal (**typically** http://localhost:8081).

📱 **Mobile Access:** Scan the QR code displayed in the terminal using Expo Go (Android/iOS).

---

### 🛠 Technologies Used

🔹 **Frontend:** React Native, TypeScript

🔹 **Backend:** Flask (Python)

🔹 **Database:** MongoDB

🔹 **Deployment:** Expo (for React Native)

## 🎥 Demo Video  



https://github.com/user-attachments/assets/4c396d23-4b19-4dab-8387-3ddcf15f1c83


