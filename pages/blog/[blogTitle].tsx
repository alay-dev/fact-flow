import { useEffect, useState } from "react"
import { Poppins } from 'next/font/google'
import Header from "@/components/header/Header"
import Image from 'next/image'
import { blog_check, initial_blog } from '@/InitalValue'
import { ImTwitter } from "react-icons/im"
import { SiFacebook, SiLinkedin } from "react-icons/si"
import { VscCopy } from "react-icons/vsc"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import moment from "moment"


const poppins = Poppins({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] })


const BlogDetail = ({ blog }: any) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false)
            }, 3000)
        }
    }, [copied])

    return (
        <>
            <Header />
            <main className={`pt-8 lg:px-48 md:px-4 px-2 sm:px-4 mt-16 pb-32 ${poppins.className}`}>
                <h1 className='mb-7 font-semibold text-center text-2xl md:text-5xl' >{blog?.title}</h1>
                <div className='mb-7 flex gap-2 items-center justify-center'  >
                    <div className='w-52 h-1 bg-gray-200' />
                    <p className='text-center text-red-600' >{blog?.category}</p>
                    <div className='w-52 h-1 bg-gray-200' />
                </div>
                <div className='flex gap-4 items-center justify-center mb-10' >
                    <div className='rounded-full overflow-hidden relative' >
                        <Image width="50" height="50" alt="Avatar" src={blog?.publisher_pic} />
                    </div>
                    <div>
                        <h4 className='font-medium' >{blog?.publisher}</h4>
                        <p className='text-gray-500 text-sm'>{moment(blog?.createdAt).format("LL")}</p>
                    </div>
                </div>
                <div className=" flex justify-center w-full h-max mb-10" >
                    <div className="relative w-full h-[25rem]">
                        <Image alt={blog?.title} fill style={{ objectFit: "cover" }} src={blog?.cover_image} />
                    </div>

                </div>

                <div className='blog-content mb-10' dangerouslySetInnerHTML={{ __html: blog?.content }} >

                </div>
                <div className='border-t-4 flex justify-between pt-4' >
                    <div />
                    <div className='flex gap-3 items-center' >
                        <button onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true) }} className='flex gap-1 items-center hover:bg-green-600 hover:text-white hover:shadow-md transition rounded-md border border-gray-400 py-1 px-4 ' >
                            {copied ?
                                <>
                                    <p className='text-sm' >Copied!</p>
                                </>
                                :
                                <>
                                    <VscCopy className='text-xl' />
                                    <p className='text-sm' >Copy Link</p>
                                </>

                            }

                        </button>
                        <button className='rounded-md border border-gray-400 py-1 px-2'>
                            <ImTwitter className='text-xl text-gray-600' />
                        </button>
                        <button className='rounded-md border border-gray-400 py-1 px-2'>
                            <SiFacebook className='text-xl text-gray-600' />
                        </button>
                        <button className='rounded-md border border-gray-400 py-1 px-2'>
                            <SiLinkedin className='text-xl text-gray-600' />
                        </button>

                    </div>
                </div>
            </main>
        </>
    )
}

export default BlogDetail


export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    const { blogTitle } = context.query
    const res = await fetch(`https://fact-flow.vercel.app/api/blogs?title=${blogTitle}`)
    const blogs = await res.json()
    return { props: { ...blogs } }
}