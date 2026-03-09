import type { UserCreate } from "../../types/user.type";

export async function register(user: UserCreate) {
  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[^\s]{8,}$/;

  // if (!passwordRegex.test(user.password)) {
  //   return {
  //     message:
  //       "password must contain at least 8 characters, one lower and one uppercase letter, at least 1 number, 1 special character, and no space between",
  //   };
  // }

  const body = JSON.stringify(user);
  console.log(body);
  const res = await fetch(import.meta.env.VITE_API_URL + "/auth/register", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: body,
  });
  const data = await res.json();

  return { message: data.message };
}
