import { Poppins } from 'next/font/google'
import Image from 'next/image'
import johnWick from "@/public/assets/johnWick.jpg"
import netflix from "@/public/assets/netflix.png"
import { BsArrowRight } from "react-icons/bs"
import NewsCard from '@/components/newsCard/NewsCard'
import Header from '@/components/header/Header'
import moment from "moment"
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import Link from 'next/link'
import useWindowSize from "@/components/useWindowSize/useWindowSize"

const poppins = Poppins({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] })



export default function Home({ blogs }: any) {
  const [width, height] = useWindowSize()

  return (
    <>
      <Header />
      <main className={`pt-9 lg:px-28 md:px-4 px-2 mt-16 ${poppins.className}`} >
        <div className='bg-gray-200 flex flex-col items-center w-full px-2 lg:py-10 sm:py-6 py-4  rounded-none md:rounded-lg'  >
          <p className='lg:mb-4  text-x text-gray-600 tracking-widest' >WELCOME TO FACT FLOW</p>
          <h1 className='font-semibold lg:text-3xl md:text-xl lg:mb-2 sm:mb-1 ' >Craft narratives that ignite <strong className='text-red-600' >inspiration</strong>,</h1>
          <h1 className='font-semibold lg:text-3xl md:text-xl' ><strong className='text-red-600' >Knowledge</strong> and <strong className='text-red-600' >entertainment</strong></h1>
        </div>
        <div className='mt-10 mb-16 flex lg:gap-16 md:gap-8 gap-4 flex-col md:flex-row' >
          <div className='relative rounded-lg overflow-hidden md:w-1/2 w-full md:h-[25rem] h-[15rem] ' >
            <Image fill alt={blogs[0].title} src={blogs[0].cover_image} />
          </div>
          <div className='flex-1' >
            <div className='flex gap-3 items-center' >
              <div className='flex gap-3 items-center' >
                <div className='relative rounded-full overflow-hidden  w-8 h-8 lg:w-14 lg:h-14' >
                  <Image fill style={{ objectFit: 'cover' }} alt={blogs[0].title} src={blogs[0].publisher_pic} />
                </div>
                <p className='text-gray-500 lg:text-xl text-sm' >{blogs[0].publisher}</p>
              </div>
              <p>&bull;</p>
              <p className='text-gray-500 lg:text-base text-sm'>{moment(blogs[0].created_at).format("LL")}</p>
            </div>
            <div className='mt-6 mb-6' >
              <Link href={`/blog/${blogs[0].title}`}>
                <h1 className='lg:text-5xl text-2xl font-semibold leading-tight' >{blogs[0].title}</h1>
              </Link>

            </div>
            <p className='text-lg text-gray-500' >{blogs[0].summary}</p>
            <div className='flex gap-3 mt-6 items-center'>
              <p className='text-red-600 lg:text-lg text-sm' >{blogs[0].category}</p>
              <p>&bull;</p>
              <p className='text-gray-500 lg:text-base text-sm'>4 min read</p>
            </div>
          </div>
        </div>
        {/* latest news */}
        <section className='pb-6' >
          <div className='flex justify-between items-center mb-8' >
            <h2 className='lg:text-3xl text-xl font-semibold'  >Latest news</h2>
            <Link href="/latest">
              <button className='flex gap-2 items-center font-medium text-green-700' >
                <p>See all</p>
                <BsArrowRight />
              </button>
            </Link>


          </div>
          <div className='flex lg:gap-10 gap-5 items-start' >
            {blogs.slice(1, width > 900 ? 5 : width > 400 ? 3 : 2).map((item: any) => {
              return <NewsCard key={item.title} title={item.title} category={item.category} publisher={item.publisher} created_at={item.created_at} cover_image={item.cover_image} publisher_pic={item.publisher_pic} summary={item.summary} />
            })}

          </div>
        </section>
        {/* Latest news */}
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<any> = async () => {
  const res = await fetch(`https://fact-flow.vercel.app/api/blogs`)
  const blogs = await res.json()
  return { props: { ...blogs } }
}
