"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { validationCheck } from "./validationCheck";
import Image from "next/image";
import GoogleLogin from "../landing/GoogleLogin";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [submitting, setSubmitting] = useState(false);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarSrc, setAvatarSrc] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const errorMessage = await validationCheck(signupData);
    if (errorMessage) {
      setSubmitting(false);
      return toast.error(errorMessage);
    }

    const { secure_url, delete_token } = await handleImageUpload();

    // signup user
    let { email, password, name } = signupData;
    name = name.toLowerCase();

    const avatar_url = (secure_url) ? secure_url : `https://ui-avatars.com/api/?size=500&name=${name}`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
        data: {
          name,
          avatar_url
        }
      },
    })
    // console.log(data, error);
    if (error) {
      handleImageDeletion(delete_token);
      toast.error(error.message);
      setSubmitting(false);
    }

    router.push("verify");
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    let json = {
      secure_url: null,
      delete_token: null
    };

    if (avatarFile) {
      formData.append("file", avatarFile);
      formData.append("upload_preset", "wmleukdy");

      const data = await fetch("https://api.cloudinary.com/v1_1/detsfgack/image/upload", {
        method: "POST",
        body: formData
      })

      json = await data.json();
    }

    return json;
  };

  const handleImageDeletion = async (deleteToken: string | null) => {
    if (deleteToken) {
      await fetch(`https://api.cloudinary.com/v1_1/detsfgack/delete_by_token`, {
        method: "POST",
        body: `token=${deleteToken}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAvatarFile(files[0]);
      setAvatarSrc(URL.createObjectURL(files[0]));
    }
  };

  return (
    <main className="flex justify-center items-center h-screen my-0">
      <div className="w-1/2">
        <Toaster />
        <h1 className="uppercase text-3xl mb-4 px-2 py-1 -skew-x-6 border-2 border-light-four bg-light-three/50 font-bold w-fit mx-auto dark:border-dark-four dark:bg-dark-five/50">Signup</h1>
        <form onSubmit={handleSubmit} className="w-full mx-auto p-4 border text-lg bg-light-four/50 rounded-md shadow-xl">
          <label className=" flex flex-col md:flex-row justify-between items-center my-1">
            Username: <input className="shadow text-sm w-full md:w-3/4 p-2 my-1 dark:text-dark-one" type="text" name="name" required
              placeholder="Enter your username" value={signupData.name || ""} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} />
          </label>
          <label className="my-1 flex flex-col  md:flex-row justify-between items-center">
            Email: <input className="shadow text-sm w-full md:w-3/4  p-2 my-1 dark:text-dark-one" type="email" name="email" required
              placeholder="Enter your email" value={signupData.email || ""} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
          </label>
          <label className="flex flex-col md:flex-row justify-between items-center my-1">
            Password: <input className="shadow text-sm w-full md:w-3/4  p-2 my-1 dark:text-dark-one" type="password" name="password" required
              placeholder="Enter your password" value={signupData.password || ""} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
          </label>
          <label className="flex flex-col  md:flex-row justify-between items-center my-1">
            Avatar:
            <input className="text-sm md:text-base shadow w-3/5 p-2 my-1 dark:text-dark-one" type="file" name="file"
              accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
            {avatarSrc && <Image src={avatarSrc} alt="" width={75} height={75} className=" border rounded-full object-cover aspect-square" />}
          </label>
          <div className="flex items-end gap-1">
            <button disabled={submitting} type="submit" className="shadow my-2 block mx-auto py-2 px-4 md:px-10 hover:scale-110 font-bold hover:text-light-three rounded-md transition-all bg-light-three hover:bg-light-five text-light-five">Signup</button>
            <GoogleLogin />
          </div>
          <span className="text-sm">Already a member? Login <Link className="underline underline-offset-4 inline-block font-semibold hover:text-light-two" href="/login">here</Link></span>
        </form>
      </div>
    </main>
  )
}