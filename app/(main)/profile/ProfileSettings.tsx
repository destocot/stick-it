"use client"
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Database } from "@/app/types/database.types";

export default function ProfileSettings({ display }: { display: string | null }) {
  const [settings, setSettings] = useState(false);
  const router = useRouter();

  const [name, setName] = useState(display);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleUpdate = async () => {

    //  upload image
    const formData = new FormData();
    if (avatarFile) {
      formData.append("file", avatarFile);
      formData.append("upload_preset", "wmleukdy");
    }

    const data = await fetch("https://api.cloudinary.com/v1_1/detsfgack/image/upload", {
      method: "POST",
      body: formData
    })

    if (avatarFile && !data.ok) {
      setAvatarFile(null);
      return toast.error("Error uploading image.");
    }

    const json = await data.json();
    const avatar_url = json.secure_url || null;

    const supabase = createClientComponentClient<Database>();
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      const userId = session.user.id;

      let options = {};
      if (name && avatar_url) {
        options = { name: name.toLowerCase(), avatar_url }
      } else if (name) {
        options = { name: name.toLowerCase() }
      } else if (avatar_url) {
        options = { avatar_url }
      }

      const { data, error } = await supabase
        .from("profiles")
        .update(options)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return toast.error("username is already taken");
        }
        return toast.error(error.message);
      }

      if (data) {
        router.refresh();
        setSettings(false);
      }
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAvatarFile(files[0]);
    }
  };

  return (
    <>
      <div className="text-base">
        <Toaster />
      </div>
      <button onClick={() => setSettings(true)}>
        <FiSettings />
      </button>
      {settings && <div className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
        <div className="absolute bg-black/50 opacity-80 inset-0 z-0"></div>
        <div className="w-full  max-w-lg p-4 relative mx-auto my-auto rounded-xl shadow-lg  dark:bg-dark-two bg-light-two ">
          <div className="">
            <div className="text-center p-4 flex-auto justify-center">
              <h2 className="text-xl font-bold py-2 ">Change Username?</h2>
              <input type="text" className="dark:text-dark-two text-lg w-full px-4 py-2 mb-2" value={name || ""} onChange={(e) => setName(e.target.value)} />
              <h2 className="text-xl font-bold py-2 ">Change Avatar?</h2>
              <input className="text-base shadow dark:text-dark-four" type="file" name="file"
                accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
            </div>
            <div className="p-3  mt-2 text-center space-x-4 md:block">
              <button onClick={() => setSettings(false)} className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
                Close
              </button>
              <button onClick={() => handleUpdate()} className="mb-2 md:mb-0 bg-light-five border border-light-two px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-dark-two">Update</button>
            </div>
          </div>
        </div>
      </div>}
    </>
  )
}

/*
<div className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
        <div className="absolute bg-black/50 opacity-80 inset-0 z-0"></div>
        <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  dark:bg-dark-two bg-light-two ">

          <div className="">

            <div className="text-center p-5 flex-auto justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 -m-1 flex items-center text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 flex items-center text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <h2 className="text-xl font-bold py-4 ">Are you sure?</h2>
              <p className="text-sm text-gray-500 px-8">Do you really want to delete your account?
                This process cannot be undone</p>
            </div>

            <div className="p-3  mt-2 text-center space-x-4 md:block">
              <button onClick={() => setSettings(false)} className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-full hover:shadow-lg hover:bg-gray-100">
                Close
              </button>
              <button className="mb-2 md:mb-0 bg-light-five border border-light-two px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-dark-two">Update</button>
            </div>
          </div>
        </div>
      </div>
*/