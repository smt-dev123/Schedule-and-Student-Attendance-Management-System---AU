// src/services/authService.ts
// ✅ ពេលមាន API server ពិតប្រាកដ — កែតែ BASE_URL និង endpoint ទីនេះ

const BASE_URL = "https://your-api.com"; // 🔁 ផ្លាស់ប្តូរ URL នៅពេលមាន server

// === MOCK DATA (លុបចោលពេលមាន API ពិតប្រាកដ) ===
const MOCK_USERS = {
  teachers: [
    { id: "T001", password: "teacher123", name: "សុខ ដារ៉ា" },
    { id: "T002", password: "teacher456", name: "លី សុភា" },
  ],
  students: [
    { id: "S001", password: "student123", name: "ចាន់ សុវណ្ណ" },
    { id: "S002", password: "student456", name: "គឹម ស្រីណា" },
  ],
};
// =============================================

export type LoginResult =
  | { success: true; name: string; id: string }
  | { success: false; message: string };

// LOGIN TEACHER
export async function loginTeacher(
  id: string,
  password: string,
): Promise<LoginResult> {
  // 🔁 ពេលមាន API — uncomment block នេះ ហើយលុប MOCK block ខាងក្រោម
  /*
  try {
    const res = await fetch(`${BASE_URL}/api/auth/teacher/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
    const data = await res.json();
    if (res.ok) return { success: true, name: data.name, id: data.id };
    return { success: false, message: data.message || "Login failed" };
  } catch {
    return { success: false, message: "មិនអាចភ្ជាប់ server បាន" };
  }
  */

  // MOCK — លុបចោលពេលមាន API
  await new Promise((r) => setTimeout(r, 800));
  const user = MOCK_USERS.teachers.find(
    (t) => t.id === id && t.password === password,
  );
  if (user) return { success: true, name: user.name, id: user.id };
  return { success: false, message: "អត្តលេខ ឬ លេខសម្ងាត់មិនត្រឹមត្រូវ" };
}

// LOGIN STUDENT
export async function loginStudent(
  id: string,
  password: string,
): Promise<LoginResult> {
  // 🔁 ពេលមាន API — uncomment block នេះ ហើយលុប MOCK block ខាងក្រោម
  /*
  try {
    const res = await fetch(`${BASE_URL}/api/auth/student/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
    const data = await res.json();
    if (res.ok) return { success: true, name: data.name, id: data.id };
    return { success: false, message: data.message || "Login failed" };
  } catch {
    return { success: false, message: "មិនអាចភ្ជាប់ server បាន" };
  }
  */

  // MOCK — លុបចោលពេលមាន API
  await new Promise((r) => setTimeout(r, 800));
  const user = MOCK_USERS.students.find(
    (s) => s.id === id && s.password === password,
  );
  if (user) return { success: true, name: user.name, id: user.id };
  return { success: false, message: "អត្តលេខ ឬ លេខសម្ងាត់មិនត្រឹមត្រូវ" };
}
