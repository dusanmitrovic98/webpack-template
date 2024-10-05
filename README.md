# Webpack TypeScript Project

A modern Webpack TypeScript setup using Babel for transpilation and automated tasks for efficient development.

## 🚀 Features

- TypeScript and Babel integration
- Webpack for bundling and development server
- Linting with ESLint and formatting with Prettier
- Version bumping and release automation
- Git workflow automation
- Environment configuration with `dotenv`

## 📋 Prerequisites

- Node.js 18+ installed
- npm installed

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dusanmitrovic98/webpack-template.git
   cd webpack-template
   npm install
   ```

## 🔧 Available Tasks

### Development & Build

- `npm run dev` - Start the development server with Webpack
- `npm run build` - Build the project for production
- `npm run prod` - Build the project with Webpack in production mode
- `npm run type-check` - Run TypeScript type checks
- `npm run start:dev` - Run the development server using tsx for TypeScript execution
- `npm run start` - Run the production build (dist/bundle.js)

### Cleaning Tasks

- `npm run clean:dist` - Remove the dist directory
- `npm run clean:config` - Remove the config.json file
- `npm run clean` - Run all cleaning tasks (dist and config)

### Code Style & Linting

- `npm run lint` - Run ESLint on the codebase
- `npm run format` - Format the codebase using Prettier

### Git Workflow

- `npm run commit` - Commit changes using automated commit message
- `npm run push` - Push changes to the remote repository
- `npm run sync` - Sync with the remote repository
- `npm run git` - Run commit, push, and sync tasks in one go

### Version Management

- `npm run version:major` - Bump major version
- `npm run version:minor` - Bump minor version
- `npm run version:patch` - Bump patch version
- `npm run rollback` - Rollback to the previous version

### Release Tasks

- `npm run release:major` - Release a major version update
- `npm run release:minor` - Release a minor version update
- `npm run release:patch` - Release a patch version update
- `npm run release` - Quick release (equivalent to patch release)

### Combined Tasks

- `npm run build:git` - Build the project and run all Git tasks (commit, push, sync)

## 🏗️ Project Structure

```
/
├── .core/            # Core utilities
│   ├── git/          # Git automation scripts
│   └── version-bump.ts  # Version management script
├── src/              # Source code
├── dist/             # Production build
├── webpack.config.js # Webpack configuration
├── tsconfig.json     # TypeScript configuration
├── package.json      # Project metadata and scripts
└── README.md         # Project documentation
```

## 🧪 Testing

Add a script in the future to handle tests, like:
```bash
npm run test
```

## 📝 Code Style

Format your code:
```bash
npm run format
```

Lint your code:
```bash
npm run lint
```

## 📚 Dependencies

This project uses Webpack for bundling, Babel for transpilation, and TypeScript for type safety. Key dependencies include:

- `typescript` - TypeScript compiler
- `webpack` - JavaScript bundler
- `@babel/core` - Babel compiler core
- `eslint` - JavaScript linter
- `prettier` - Code formatter
- `semver` - Semantic versioning utility

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Run tests, linting, and formatting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

MIT License

Copyright (c) 2024 Dušan Mitrović

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 📞 Contact

Dušan Mitrović - [@dusanmitrovic98](https://twitter.com/dusanmitrovic98) - dusanmitrovicoffice@gmail.com

Project Link: [https://github.com/dusanmitrovic98/webpack-template](https://github.com/dusanmitrovic98/webpack-template)