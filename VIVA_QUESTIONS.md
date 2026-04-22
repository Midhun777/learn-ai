# 🎓 SkillRoute AI: Viva/Interview Questions (25)

This document contains 25 potential questions for your project viva, categorized by development area.

---

### 🌐 1. Project Overview & Architecture
1. **Explain the core concept of SkillRoute AI.**
   *   *Recommended Answer:* It's an AI-powered smart college portal that generates customized learning roadmaps, allows peer/mentor interaction, and tracks progress toward certifications through project-based learning.
2. **Describe your Tech Stack.**
   *   *Answer:* MERN Stack (MongoDB, Express.js, React, Node.js) with Vite as the build tool and Tailwind CSS / Custom SaaS CSS for the UI.
3. **What is the significance of the "Capstone Project" in your workflow?**
   *   *Answer:* It serves as the final graduation requirement. A user cannot be "Completed" or get a certificate without submitting a comprehensive project that proves their mastery.
4. **How do you handle different User Roles (Student, Mentor, Admin)?**
   *   *Answer:* Using JWT (JSON Web Tokens) for authentication and role-based middleware on the backend to restrict access to specific API routes.
5. **How are the Roadmaps actually generated?**
   *   *Answer:* We utilize AI (LLM integration) to parse a skill name and generate a structured JSON object containing phases, topics, and hands-on projects tailored to that skill.

---

### ⚙️ 2. Backend & Database (Node.js/MongoDB)
6. **How is the Roadmap data structured in MongoDB?**
   *   *Answer:* We use a schema that contains arrays of `phases`, which further contain `topics` and a `handsOnProject`. It also includes a top-level `capstoneProject` and an `isCompleted` flag.
7. **How does the system automatically recalculate the "Completed" status?**
   *   *Answer:* Whenever a mentor approves a project, the backend checks if *all* topics are marked complete AND *all* projects (Phase + Capstone) are approved. If yes, it sets `isCompleted: true`.
8. **Explain your API routing structure.**
   *   *Answer:* Routes are separated into modules: `/api/roadmap` for learning paths, `/api/mentor` for approvals, and `/api/user` for profiles and auth.
9. **What is the difference between `PUT` and `POST` in your API?**
   *   *Answer:* We use `POST` to generate new roadmaps and `PUT` to update existing ones (like marking a topic complete or submitting a project URL).
10. **How do you handle database connectivity?**
    *   *Answer:* Using Mongoose with an environment-variable-based connection string (`MONGODB_URI`) to ensure security and flexibility.

---

### 🎨 3. Frontend & User Experience (React)
11. **Why did you choose Vite over Create-React-App?**
    *   *Answer:* Vite provides significantly faster cold starts and Hot Module Replacement (HMR) by using native ES modules.
12. **How do you manage State in the `RoadmapView` component?**
    *   *Answer:* Using React's `useState` for local UI state (modals, progress updates) and `useEffect` to fetch data from the server upon component mounting.
13. **Explain the "Guided" vs. "Non-Guided" mode implementation.**
    *   *Answer:* In Guided mode, we use logic to "lock" topics. A topic is only clickable if the previous topic in the array has `completed: true`.
14. **How are the progress bars calculated dynamically?**
    *   *Answer:* We filter the `topics` array to find completed vs. total items and calculate the percentage: `(completed / total) * 100`.
15. **How did you implement the "Certificate of Completion" UI?**
    *   *Answer:* It's a conditional overlay that only renders when the `showCert` state is true. It pulls the user's name and skill name directly from the roadmap data.

---

### 🛠️ 4. Debugging & Problem Solving (Critical)
16. **Describe a major technical challenge you faced and how you solved it.**
    *   *Answer:* The "Roadmap Deadlock." Users were hitting 100% progress but never getting certificates because the Capstone project was missing from the UI. We solved this by implementing the Capstone submission UI and updating the mentor approval logic to trigger completion checks.
17. **What happens if a Mentor rejects a project?**
    *   *Answer:* The project status is updated to `Rejected`. The UI then dynamically shows a "Resubmit" button instead of the original "Start Project" button.
18. **How do you ensure the UI stays updated without a page refresh?**
    *   *Answer:* After every successful API call (like marking a topic), we update the local React state with the fresh data returned from the server.
19. **How do you handle 404 or Server Errors on the frontend?**
    *   *Answer:* We use `try...catch` blocks around our `fetch`/`axios` calls and display "Toast" notifications (using `hot-toast`) to inform the user of errors.
20. **How did you fix the recent "Adjacent JSX" syntax error?**
    *   *Answer:* By wrapping sibling elements (Phases loop and Capstone section) in a React Fragment (`<>...</>`) to satisfy the requirement that a component/block returns a single parent element.

---

### 🚀 5. Advanced & Future Scope
21. **How would you make this scalable for thousands of users?**
    *   *Answer:* Implement Redis for caching roadmap data, use a CDN for profile images, and optimize MongoDB indexing on the `userId` and `roadmapId` fields.
22. **How could you improve the AI generation further?**
    *   *Answer:* By feeding the AI more context about the user's current level (Beginner/Intermediate) and allowing it to suggest specific YouTube or documentation links.
23. **What security measures are in place?**
    *   *Answer:* Password hashing using bcrypt, JWT for session management, and sanitizing user inputs to prevent NoSQL injection.
24. **How would you implement a "Community" feature?**
    *   *Answer:* By creating a new `Forum` schema where users can post questions linked to specific Roadmaps or Topics.
25. **If you had more time, what is the #1 feature you would add?**
    *   *Answer:* A real-time collaboration tool or a "Live Mentor Chat" using Socket.io.

---
© 2026 SkillRoute AI | Developed by Midhun Mathew & Team
