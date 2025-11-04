CBT Module – RESTful API
A robust Computer-Based Test (CBT) Management System built with Node.js, Express, and Prisma ORM.
The API provides complete backend functionality for managing users (Admin, Teacher, Student), subjects, exams, questions, and results — with role-based access and JWT authentication.

Features


Authentication & Authorization


Secure JWT-based login for Admins, Teachers, and Students.


Role-based access control using middleware.



 Admin Capabilities


Create and manage classes, subjects, teachers, and students.


Assign subjects to teachers.




Teacher Capabilities


Create, update, and manage exams and questions.


View assigned subjects.


Access student results for their subjects.




Student Capabilities


Take exams and view results.




Database Layer


Powered by Prisma ORM (PostgreSQL compatible).




Error Handling


Centralized error handling with AppError and custom response utilities.




Modular Folder Structure


Cleanly separated controllers, routes, and utilities for scalability.





Project Structure
cbt-module/
│
├── index.js
│
├── prisma/
│   └── schema.prisma
│
├── controllers/
│   ├── adminController.js
│   ├── teacherController.js
│   ├── studentController.js
│   ├── examController.js
│   ├── questionController.js
│   ├── resultController.js
│   └── authController.js
│
├── routes/
│   ├── adminRoutes.js
│   ├── teacherRoutes.js
│   ├── studentRoutes.js
│   └── authRoutes.js, resultRoutes, examsRoutes

│Services[
    adminService.js
    teacherService.js
    studentService.js
    examService.js
    questionsService.js
    resultService.js
    authController.js
]

├── middleware/
│   ├── auth.js
│   └── roles.js
│
├── utils/
│   ├── token.js
│   └── response.js
│
├── .env
└── package.json


Technologies Used
CategoryTools / LibrariesRuntimeNode.jsFrameworkExpress.jsORMPrismaDatabasePostgreSQLAuthenticationJWT (jsonwebtoken)Password HashingbcryptjsError HandlingCustom AppError, Async HandlerEnvironment Managementdotenv

Installation & Setup
Clone the Repository
git clone https://github.com/Shehu Baje/cbt-module.git
cd cbt-module

Install Dependencies
npm install express cors bcryptjs jsonwebtoken

Configure Environment Variables
Create a .env file in the root directory
Use this template as a guide:
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/cbt_db"
SECRET_JWT="your_secret_key"
ADMIN_EMAIL="admin@cbt-school.com"
ADMIN_PASSWORD="admin123"
NODE_ENV=development
PORT=3000


Database Setup
Initialize Prisma
npx prisma init

Push Schema to Database
npx prisma db push

(Optional) Open Prisma Studio
npx prisma studio


Available API Endpoints
Auth Routes
MethodEndpointDescriptionPOST/api/auth/registerRegister a new user (Admin/Teacher/Student)POST/api/auth/loginLogin and receive JWT token
Admin Routes
MethodEndpointDescriptionPOST/api/admin/classCreate a new classPOST/api/admin/subjectCreate a new subjectPOST/api/admin/teacherAdd a teacherPOST/api/admin/studentAdd a studentPUT/api/admin/teacher/:idUpdate teacher infoPUT/api/admin/student/:idUpdate student infoDELETE/api/admin/teacher/:idDelete teacherDELETE/api/admin/student/:idDelete studentPOST/api/admin/assign-subjectAssign subject to teacher
Teacher Routes
MethodEndpointDescriptionGET/api/teacher/subjectsGet all assigned subjectsPOST/api/teacher/examsCreate a new examPOST/api/teacher/questionsAdd questions to an examGET/api/teacher/resultsView results of their students
Student Routes
MethodEndpointDescriptionGET/api/student/examsView available examsPOST/api/student/submitSubmit exam answersGET/api/student/resultsView own results

Running the Server
npm run dev

Then visit:
http://localhost:3000/api


Development Scripts
CommandDescriptionnpm run devStart server in development mode (nodemon)npm startStart server in production modenpx prisma studioLaunch Prisma Studionpx prisma migrate devRun migrations for dev database

Error Handling
All errors are handled via a global middleware:


AppError for operational errors.


Custom responses with status codes and messages.


Safe JSON response format for frontend use.


Example error response:
{
  "success": false,
  "error": "Teacher is already assigned to this subject"
}


Security Practices


JWT tokens stored securely.


Passwords hashed with bcrypt.


Sensitive config stored in .env.


.env is added to .gitignore.



Author
Baje Shehu Umar
Fullstack software enginner | Node.js | Express | Prisma
Email: Shehuumarbaje@gmail.com
Location: FCT, Abuja, Nigeria
