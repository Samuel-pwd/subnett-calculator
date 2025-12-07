# 🌐 Subnet Calculator

A networking project by a self-taught cybersecurity enthusiast!  
A lightweight subnet calculator built with pure HTML, CSS, and JavaScript, deployed online.

## 🚀 Features

- 🔢 Calculate subnet details from IP and CIDR
- 🔁 Supports both formats: CIDR notation (e.g., 24) or subnet mask (e.g., 255.255.255.0)
- ⚡ Handles special cases: /31 (point-to-point) and /32 (single host)
- 🎨 Clean dark theme optimized for mobile
- 📱 Zero dependencies

## 📊 What It Calculates

- ✅ Subnet Mask
- ✅ Wildcard Mask
- ✅ Network Address
- ✅ Broadcast Address
- ✅ First & Last Usable Host
- ✅ Total Usable Hosts
- ✅ Total Addresses in Subnet
- ✅ Network & Host Bits

## 🛠️ Technologies

- HTML5 - Semantic markup  
- CSS3 - Custom properties, Flexbox, responsive design  
- Vanilla JavaScript - Bitwise operations for subnet math  
- Git & GitHub - Version control  
- Render - Static site hosting  

## 📖 How to Use

1. Enter an IPv4 address (e.g., 192.168.1.45)  
2. Enter CIDR (e.g., 24) or subnet mask (e.g., 255.255.255.0)  
3. Click "Calculate Subnet"  
4. View all subnet details instantly  

## 🎯 Learning Outcomes

This project helped me understand:

- IPv4 addressing and subnetting fundamentals  
- CIDR notation and binary math  
- Network segmentation concepts  
- How to build and deploy a web app from scratch  
- Git workflow and deployment to Render  

## 🖥️ Local Development

```bash
# Clone the repository
git clone https://github.com/Samuel-pwd/subnett-calculator.git

# Navigate to project
cd subnett-calculator

# Open in browser
# Just open index.html in any browser
```

## 📁 Project Structure

```
subnett-calculator/
├── index.html    # Main HTML file
├── style.css     # Styling (dark theme)
├── app.js        # Subnet calculation logic
└── README.md     # This file
```

## 🤝 Contributing

Found a bug or have suggestions? Open an issue or submit a pull request!

## 📄 License

Open source and available for learning purposes.

---

🌟 Live Demo

[Subnet Calculator – Live on Render](https://subnett-calculator.onrender.com)