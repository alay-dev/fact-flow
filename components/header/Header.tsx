import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { GoBell } from "react-icons/go"
import { HiOutlinePencilSquare } from "react-icons/hi2"
import { useSession, signIn, signOut } from 'next-auth/react'
import googleLogo from "@/public/assets/googleLogo.svg"
import facebookLogo from "@/public/assets/facebookLogo.png"
import { useRouter } from 'next/router'
import { Modal } from "@mui/material"

const Header = () => {
    const [loginModal, setLoginModal] = useState(false)
    const { data: session } = useSession();

    const router = useRouter()

    return (
        <div className="bg-white  z-10 flex justify-between fixed h-30 top-0 left-0 w-full md:px-8 px-3 py-4 header-shadow" >
            <div className="flex gap-6" >
                <Link href="/">
                    <h3 className="text-red-500 text-2xl font-medium" >Fact Flow</h3>
                </Link>

                <div className="w-1 h-full bg-red-500  " ></div>
                <ul className="md:flex gap-5 items-center md:visible hidden ">
                    <li>Stories</li>
                    <li>Creator</li>
                    <li>Community</li>
                    <li>Subscribe</li>
                </ul>
            </div>
            {session &&
                <ul className="flex gap-5 items-center ">
                    <Link href={"/write"}>

                        <li className="flex gap-1 cursor-pointer hover:text-blue-500">
                            <HiOutlinePencilSquare className="text-xl" />
                            <p>Write</p>
                        </li>
                    </Link>
                    <li className="cursor-pointer" >
                        <GoBell className="text-xl" />
                    </li>
                    <li className="rounded-full overflow-hidden cursor-pointer" onClick={() => { signOut(); router.push("/") }}>
                        <Image width="40" height="40" alt="Avatar" src={session?.user?.image!} />
                    </li>

                </ul>}
            {!session && <button onClick={() => setLoginModal(true)} className="hover:bg-black transition bg-blue-600 text-white py-1 px-5 rounded-md" >Sign in</button>}
            {/* {!session && <button className="flex gap-2 items-center border rounded-md px-2 py-1" onClick={() => signIn("google")} >
                <Image src={googleLogo} alt="Google Login" width={25} height={25} />
                Sign in google</button>} */}
            <Modal open={loginModal} onClose={() => setLoginModal(false)} >
                <div className="outline-none absolute w-[25rem]  rounded-md p-8 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" >
                    <p className="mb-8 text-lg "><strong>Login</strong> and start writing your own news...</p>
                    <div className="flex flex-col items-center">
                        <button onClick={() => signIn("google")} className="py-3 px-7 rounded-md border flex items-center gap-3" >
                            <Image src={googleLogo} width={25} height={25} alt="google login" />
                            Continue with google
                        </button>
                        <div className="flex items-center gap-3 mt-2 mb-2">
                            <div className="h-1 bg-gray-200 w-16" />
                            <p>OR</p>
                            <div className="h-1 bg-gray-200 w-16" />
                        </div>
                        <button onClick={() => signIn("facebook")} className="py-3 px-7 rounded-md border flex items-center gap-3" >
                            <Image src={facebookLogo} width={25} height={25} alt="google login" />
                            Continue with facebook
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Header