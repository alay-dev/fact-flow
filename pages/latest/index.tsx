import Header from '@/components/header/Header'
import NewsCard from '@/components/newsCard/NewsCard'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { Poppins } from 'next/font/google'
import { useMemo } from 'react'

const poppins = Poppins({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] })

const LatestNews = ({ blogs }: any) => {
    const sortedNews = useMemo(() => {
        return blogs.sort((a: any, b: any) => Number(new Date(b.created_at)) - Number(new Date(a.created_at)))
    }, [blogs])

    return (
        <>
            <Header />
            <main className={`pt-9 lg:px-28 md:px-4 px-2 mt-16 ${poppins.className}`} >
                <h1 className='font-semibold text-3xl mb-8' >Latest news</h1>
                <div className='grid lg:grid-cols-4 grid-col-1 lg:gap-12 sm:gap-8 gap-6 sm:grid-cols-2  ' >
                    {sortedNews?.map((item: any) => {
                        return <NewsCard

                            key={item.title}
                            title={item.title}
                            category={item.category}
                            publisher={item.publisher}
                            created_at={item.created_at}
                            cover_image={item.cover_image}
                            publisher_pic={item.publisher_pic}
                            summary={item.summary}
                        />
                    })}

                </div>
            </main>
        </>
    )
}

export default LatestNews

export const getServerSideProps: GetServerSideProps<any> = async () => {
    const res = await fetch(`https://fact-flow.vercel.app/api/blogs`)
    const blogs = await res.json()
    return { props: { ...blogs } }
}