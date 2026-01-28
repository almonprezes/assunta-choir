# Contributing to Assunta Choir Website

Thank you for your interest in contributing to the Assunta Choir website! This document provides guidelines for contributors.

## 🎵 Project Overview

The Assunta Choir website is a full-stack web application for managing choir activities, including:
- Public concert information
- Member-only resources (recordings, sheet music, rehearsal schedules)
- User authentication and role management
- File upload and management

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, React Router, React Query
- **Backend**: Node.js, Express, SQLite, JWT authentication
- **File Handling**: Multer for audio/PDF uploads
- **Deployment**: PM2, GitHub Actions

## 📋 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/assunta-choir-website.git
   cd assunta-choir-website
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
assunta-choir-website/
├── backend/                 # Node.js API server
│   ├── routes/             # API endpoints
│   ├── database.js         # SQLite database setup
│   └── uploads/            # File storage
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── contexts/       # React contexts
└── README.md
```

## 🤝 Contributing Guidelines

### Code Style
- Use JavaScript/JSX for React components
- Follow existing naming conventions
- Use Tailwind CSS for styling
- Keep components small and focused

### Submitting Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for adding or updating tests

## 🐛 Bug Reports

When reporting bugs, please include:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser, Node.js version)

## 💡 Feature Requests

Feature requests are welcome! Please:
- Describe the feature clearly
- Explain the use case
- Consider if it fits the project goals

## 📝 Development Notes

### Database
- Uses SQLite with automatic table creation
- Admin user (Norbert) is created automatically
- Database file: `backend/assunta_choir.db`

### File Uploads
- Audio files: MP3, WAV, M4A, OGG
- Sheet music: PDF
- Stored in `backend/uploads/` directory
- Max file size: 50MB

### Authentication
- JWT tokens for authentication
- Roles: `member`, `admin`
- Norbert (username: norbert) has admin privileges

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Deployment

The project uses GitHub Actions for automatic deployment to production. Ensure:
- All tests pass
- Build completes successfully
- Environment variables are configured

## 🤝 Community

- Be respectful and inclusive
- Help others learn and contribute
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## 📞 Contact

For questions or support:
- Create an issue in the repository
- Contact the project maintainers

---

Thank you for contributing to the Assunta Choir website! 🎶
