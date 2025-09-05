# 🛒 Grocery Buddy

A modern, feature-rich grocery shopping app built with React Native and Expo. Organize your shopping lists, manage items by categories, and streamline your grocery shopping experience.

## ✨ Features

- **Smart Shopping Lists**: Create and manage multiple grocery lists
- **Category Organization**: Organize items by predefined categories (Fruits, Vegetables, Dairy, etc.)
- **Item Management**: Add, edit, and delete grocery items with details like quantity, price, and notes
- **Priority System**: Set priority levels (low, medium, high) for important items
- **Progress Tracking**: Mark items as completed and track your shopping progress
- **User Authentication**: Secure login and signup with Clerk authentication
- **QR Code Support**: Generate and scan QR codes for easy list sharing
- **Cross-Platform**: Works on iOS, Android, and Web
- **Offline Support**: Local data storage with SQLite
- **Modern UI**: Clean, intuitive interface with themed components

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DiluDevX/Grocery-Buddy.git
   cd grocery-buddy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Clerk publishable key:

   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

### Running the App

In the output, you'll find options to open the app in:

- **Development build**: For testing on physical devices
- **iOS Simulator**: `npm run ios`
- **Android Emulator**: `npm run android`
- **Web browser**: `npm run web`
- **Expo Go**: Scan the QR code with the Expo Go app

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Authentication**: Clerk
- **Database**: SQLite (expo-sqlite)
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Custom themed components
- **Camera**: Expo Camera (for QR code scanning)
- **Storage**: Async Storage & Expo Secure Store
- **Development Tools**:
  - TypeScript for type safety
  - ESLint for code quality
  - Husky for git hooks
  - Commitlint for conventional commits

## 📱 App Structure

```
app/
├── (auth)/          # Authentication screens
│   ├── signIn.tsx   # Sign in screen
│   └── signUp.tsx   # Sign up screen
├── (tabs)/          # Main app tabs
│   ├── index.tsx    # Home/Grocery list screen
│   ├── settings.tsx # Settings screen
│   └── shared.tsx   # Shared lists screen
└── _layout.tsx      # Root layout

components/
├── ui/              # Reusable UI components
├── AddItemModal.tsx # Add item modal
├── GroceryItemComponent.tsx # Individual grocery item
└── ...

contexts/
├── AuthContext.tsx    # Authentication state
└── GroceryContext.tsx # Grocery lists state

types/
└── grocery.ts       # TypeScript interfaces
```

## 🎯 Key Features Implementation

### Authentication

- Secure user authentication with Clerk
- Token caching for seamless user experience
- Protected routes for authenticated users

### Grocery Management

- Create multiple shopping lists
- Add items with details (name, category, quantity, price, notes)
- Mark items as completed
- Set priority levels
- Delete items with confirmation

### Categories

Predefined categories include:

- 🍎 Fruits & Vegetables
- 🥛 Dairy & Eggs
- 🍞 Bakery
- 🥩 Meat & Seafood
- 🥫 Canned Goods
- And more...

## 🔧 Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint code quality checks
- `npm run reset-project` - Reset to blank project template

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://conventionalcommits.org/). Please format your commits as:

```
type(scope): description

[optional body]
```

Examples:

- `feat: add item deletion functionality`
- `fix: resolve authentication token refresh issue`
- `docs: update README with setup instructions`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev) for the amazing React Native framework
- [Clerk](https://clerk.dev) for seamless authentication
- [React Hook Form](https://react-hook-form.com) for efficient form handling
- All the open-source contributors who made this project possible

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Contact the maintainer: [@DiluDevX](https://github.com/DiluDevX)

---

Made with ❤️ by [DiluDevX](https://github.com/DiluDevX)
