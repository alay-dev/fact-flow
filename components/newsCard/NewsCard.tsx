import moment from "moment"
import Image from "next/image"
import f1Logo from "@/public/assets/f1Logo.png"
import Link from "next/link"

const NewsCard = ({ title, category, publisher, cover_image, created_at, publisher_pic, summary }) => {
    return (
        <div className="flex-1">
            <div className="rounded-md relative w-full md:h-[15rem] h-44 overflow-hidden mb-4" >
                <Image fill src={cover_image} alt={title} />
            </div>
            <div className="flex gap-1 md:gap-2 items-center mb-4" >
                <div className="flex items-center gap-1" >
                    <div className="rounded-full relative w-8 h-8 overflow-hidden" >
                        <Image alt="F1 logo" fill style={{ objectFit: "cover" }} src={publisher_pic} />
                    </div>
                    <p className="text-gray-500 md:text-base sm:text-xs">{publisher}</p>
                </div>
                <p>&bull;</p>
                <p className="text-gray-600 text-sm md:text-base" >{moment(created_at).format("LL")}</p>
            </div>
            <Link href={`/blog/${title}`}>
                <h2 className="md:text-xl text-base  font-medium mb-1 hover:text-blue-600 cursor-pointer" >{title}</h2>
            </Link>

            <p className="text-gray-500 md:text-base text-sm">{summary}</p>
            <div className='flex gap-3 mt-3 items-center'>
                <p className='text-red-600' >{category}</p>
                <p>&bull;</p>
                <p className='text-gray-500 text-sm'>4 min read</p>
            </div>
        </div>
    )
}

export default NewsCard