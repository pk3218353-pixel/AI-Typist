# Contributing to AI Typist

Thank you for your interest in contributing to **AI Typist**! We welcome bug reports, feature requests, documentation improvements, and pull requests from developers of all skill levels.

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful, welcoming, and collaborative environment.

---

## How to Contribute

### 1. Report Bugs or Request Features
If you find a bug or have an idea for a new feature, please [open an issue](https://github.com/pk3218353-pixel/AI-Typist/issues) explaining:
* The steps to reproduce the issue (for bugs).
* The expected vs. actual behavior.
* Screenshots or logs (if applicable).

### 2. Submit Pull Requests
If you'd like to write code to fix a bug or add a feature, please follow these steps:

#### Step 1: Fork and Clone
1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/AI-Typist.git
   cd AI-Typist
   ```

#### Step 2: Set Up Development Environments

##### Backend (FastAPI)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .\.venv\Scripts\Activate.ps1
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies (including testing tools):
   ```bash
   pip install -r requirements.txt
   pip install pytest
   ```
4. Copy the environment variables template and customize it:
   ```bash
   copy .env.example .env  # Windows
   cp .env.example .env    # macOS/Linux
   ```
5. Run the tests to make sure everything passes:
   ```bash
   python -m pytest
   ```
6. Start the development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

##### Frontend (React + Vite)
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Copy the environment template:
   ```bash
   copy .env.example .env  # Windows
   cp .env.example .env    # macOS/Linux
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## Pull Request Guidelines

* **Create a branch**: Never commit directly to `main`. Create a descriptive feature branch: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`.
* **Write clean code**: Adhere to PEP 8 standards for Python and standard formatting guidelines for TypeScript/React.
* **Keep commits clean**: Write clear, descriptive commit messages.
* **Run tests & lint**: Ensure all tests pass (`pytest` in the backend) and types check successfully (`npm run build` in the frontend) before pushing.
* **Open the PR**: Push your branch to GitHub and open a Pull Request against our `main` branch. Provide a summary of the changes in the description.

Thank you again for making AI Typist better!
