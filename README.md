# Todo Application
## Overview
This project is a simple Todo Application where users can register, log in, and manage their tasks. Built using jQuery, the app allows users to create, edit, delete, and categorize their tasks.

## Features
* User Registration and Login
* Create, Edit, and Delete Tasks
* Organize Tasks by Categories
* Mark Tasks as Completed
## Table of Contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [File Structure](#file-structure)
- [API Endpoints](#api-endpoints)

  
## Getting Started
### Prerequisites
* A web browser (Chrome, Firefox, Safari, or Edge)
* Internet connection
## Usage

### Register

1. Click **Sign Up** on the main page.
2. Fill out your name, email, and password.
3. Click **Register**.

### Login

1. Click **Login** on the main page.
2. Enter your email and password.
3. Click **Login**.

### Managing Tasks

- **Add a Task**: Click **Add New Task**, fill out the form, and click **Submit**.
- **Edit a Task**: Click the edit icon next to a task, update it, and click **Submit**.
- **Delete a Task**: Click the delete icon next to a task and confirm.

### Categories

- **Add a Category**: Click **Add Category**, choose a color, enter a name, and click **Submit**.
- **Edit a Category**: Click the edit icon next to a category, update it, and click **Submit**.
- **Delete a Category**: Click the delete icon next to a category and confirm.

## File Structure

- `index.html`: The main page.
- `home.html`: The todo list page.
- `script.js`: Handles registration and login.
- `home.js`: Manages tasks and categories.

## API Endpoints
- **Base URL**:  http://todo.reworkstaging.name.ng/v1
- **Register**: `POST /users`
  - Data: `{ "name": "string", "email": "string", "password": "string" }`
- **Login**: `POST /users/login`
  - Data: `{ "email": "string", "password": "string" }`
- **Add Task**: `POST /tasks`
  - Data: `{ "tag_id": "number", "title": "string", "content": "string" }`
- **Edit Task**: `PUT /tasks/{taskId}`
  - Data: `{ "title": "string", "content": "string" }`
- **Delete Task**: `DELETE /tasks/{taskId}`
- **Add Category**: `POST /tags`
  - Data: `{ "user_id": "number", "title": "string", "color": "string" }`
- **Edit Category**: `PUT /tags/{tagId}`
  - Data: `{ "title": "string", "color": "string" }`
- **Delete Category**: `DELETE /tags/{tagId}`


This project is part of a series of assessments given to me by my traning academy.

