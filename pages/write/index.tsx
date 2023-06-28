//@ts-nocheck

import Header from '@/components/header/Header'
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Poppins } from 'next/font/google'
const poppins = Poppins({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800"] })
import { Editor } from '@tinymce/tinymce-react';
import { initial_blog } from '@/InitalValue';
import { BsUpload } from "react-icons/bs"
import { IoMdClose } from "react-icons/io"
import Image from 'next/image';
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';

const firebaseConfig = {
    apiKey: "AIzaSyCx14egAfXW23IFhbUWrKiOhWius0Ghse4",
    authDomain: "fact-flow.firebaseapp.com",
    projectId: "fact-flow",
    storageBucket: "fact-flow.appspot.com",
    messagingSenderId: "32919358536",
    appId: "1:32919358536:web:9a084163325c0211fc1c7d"
};

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

const Write = () => {
    const [title, setTitle] = useState("")
    const [coverImage, setCoverImage] = useState<any>(null)
    const [category, setCategory] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [error, setError] = useState(false)
    const [coverimgUploading, setCoverimgUploading] = useState(false)
    const [summary, setSummary] = useState("");
    const [postLoading, setPostLoading] = useState(false)
    const [width, height] = useWindowSize();

    const router = useRouter()
    const { data: session } = useSession()

    // useEffect(() => {
    //     if (!session) router.push("/")
    // }, [session])



    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            // console.log(editorRef.current?.getContent());
        }
    };

    const app = initializeApp(firebaseConfig);

    const storage = getStorage(app)

    const handleSubmit = () => {
        // e.preventDefault()
        const file = coverImage

        if (!file) return;

        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        setCoverimgUploading(true);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                // setProgresspercent(progress);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setCoverimgUploading(false)
                    setImgUrl(downloadURL)
                });
            }
        );
    }


    const post_blog = async () => {
        if (title === "Untitled" || imgUrl === "" || category === "") return setError(true)
        setPostLoading(true)
        const data = await fetch("http://localhost:3000/api/blogs", {
            method: "POST",
            body: JSON.stringify({
                title: title,
                content: editorRef?.current?.getContent(),
                publisher: session?.user?.name,
                category: category,
                coverImage: imgUrl,
                publisherPic: session?.user?.image,
                summary: summary
            })
        })

        setPostLoading(false)
    }

    useEffect(() => {
        if (!coverImage) setImgUrl("")
        if (coverImage) handleSubmit()
    }, [coverImage])

    // useEffect(() => {
    //     if (session) {
    //         const textarea = document.querySelector("#title");
    //         textarea?.addEventListener('input', autoResize, false);

    //         function autoResize() {
    //             this.style.height = 'auto';
    //             this.style.height = this.scrollHeight + 'px';
    //         }
    //     }
    // }, [session])

    if (!session) {
        return null
    }

    if (width < 800) {
        return <>
            <Header />
            <main className={`pt-9 pb-10 h-full mt-16 flex gap-3 justify-center  ${poppins.className}`} >
                <p className='text-center'>Please use a desktop for writing a blog.</p>
            </main>
        </>
    }

    return (
        <>
            <Header />
            <main className={`pt-9 pb-10 h-full mt-16 flex gap-3  ${poppins.className}`} >
                <div className='w-9/12 ml-10 h-full' >
                    <input
                        id="title"
                        className='mb-2 outline-none focus:border-b-4 border-b border-blue-300 w-4/6 font-semibold text-3xl text-gray-900 resize-none max-h-max'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Untitled'
                    />
                    {error && title === "Untitled" &&
                        <p className='text-red-400 text-sm' >*Please give a title</p>}
                    <Editor
                        apiKey='isx0p08o4hx1nsesbfis69qvbzasp30ez2nyrgejelhfu2e0'
                        onInit={(evt, editor) => editorRef.current = editor}
                        onBlur={(evt, editor) => console.log(editor.getContent())}
                        initialValue={'<p>Start writing from here....'}
                        init={{
                            height: '80vh',
                            menubar: false,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'image code',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'typography',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'emoticons'
                            ],
                            automatic_uploads: true,
                            file_picker_types: 'image',
                            file_picker_callback: (cb, value, meta) => {
                                const input = document.createElement('input');
                                input.setAttribute('type', 'file');
                                input.setAttribute('accept', 'image/*');

                                input.addEventListener('change', (e) => {
                                    const file = e.target?.files[0];

                                    const reader = new FileReader();
                                    reader.addEventListener('load', () => {
                                        /*
                                          Note: Now we need to register the blob in TinyMCEs image blob
                                          registry. In the next release this part hopefully won't be
                                          necessary, as we are looking to handle it internally.
                                        */
                                        const id = 'blobid' + (new Date()).getTime();
                                        const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                                        const base64 = reader.result.split(',')[1];
                                        const blobInfo = blobCache.create(id, file, base64);
                                        blobCache.add(blobInfo);

                                        /* call the callback and populate the Title field with the file name */
                                        cb(blobInfo.blobUri(), { title: file.name });
                                    });
                                    reader.readAsDataURL(file);
                                });

                                input.click();
                            },
                            spellchecker_active: true,
                            emoticons_database: 'emojiimages',
                            emoticons_append: {
                                custom_mind_explode: {
                                    keywords: ['brain', 'mind', 'explode', 'blown'],
                                    char: '🤯'
                                }
                            },
                            font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'image emoticons',
                            content_style: "@import url('https://fonts.googleapis.com/css?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'); body { font-family: Poppins !important; font-size:18px }",
                        }}
                    />
                </div>
                <div className='w-4/12 px-4 border-l h-full' >
                    <div className='mb-3'>
                        <h4 className='text-sm text-gray-600' >Add a cover image</h4>
                        {error && imgUrl === "" &&
                            <p className='text-red-400 text-sm' >*Please add a cover image</p>}
                    </div>

                    <div className='relative mb-6 w-full h-60 bg-gray-100 rounded-md border-dashed border-4 flex items-center justify-center' >
                        {coverImage &&
                            <button onClick={() => setCoverImage(null)} className='absolute top-2 right-2 rounded-full p-2 bg-white'>
                                <IoMdClose className='text-xl' />
                            </button>}
                        {coverImage ?
                            <Image alt="Cover image" src={URL.createObjectURL(coverImage)} height={200} width={200} />
                            :
                            <>
                                <label htmlFor='coverImg' className=' flex items-center gap-2 cursor-pointer hover:bg-black transition bg-blue-700  shadow-md text-white rounded-md py-2 px-5'  >
                                    <BsUpload className='text-xl' />
                                    <p className='text-sm' >Upload</p>
                                </label>
                                <input accept='image/*' onChange={(e) => e.target.files?.length && setCoverImage(e.target.files[0])} className='hidden' type='file' id="coverImg" />
                            </>}
                    </div>
                    {/* <h4 className='mb-3' >Add tags for better reach</h4>
                    <input placeholder='Enter to add tag' className='mb-6 px-2 outline-none border w-full rounded-md h-10' /> */}
                    <h4 className='mb-3 text-sm text-gray-600' >Category</h4>
                    <div className=' mb-6'>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className=' px-2 outline-none border w-full rounded-md h-10' >
                            <option value="" disabled selected >Choose a category</option>
                            <option value="Movie">Movies</option>
                            <option value="Sport">Sports</option>
                            <option value="Crime">Crime</option>
                            <option value="Business">Business</option>
                            <option value="Travel">Travel</option>
                            <option value="Future">Future</option>
                            <option value="Worklife">Worklife</option>
                            <option value="Weather">Weather</option>
                            <option value="Tech">Tech</option>
                            <option value="Economy">Economy</option>
                            <option value="Music">Music</option>
                            <option value="TV">TV</option>
                            <option value="Culture">Culture</option>
                            <option value="World">World</option>
                        </select>
                        {error && category === "" &&
                            <p className='text-red-400 text-sm' >*Please choose a category</p>}
                    </div>
                    <div className='mb-6' >
                        <div className='mb-3'>
                            <h4 className=' text-sm text-gray-600' >Summary (in about 50 words)</h4>
                            {error && summary === "" &&
                                <p className='text-red-400 text-sm' >*Please provide a summary</p>}
                        </div>
                        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} className='border w-full h-32 outline-none p-2 resize-none' />

                    </div>

                    <button disabled={coverimgUploading || postLoading} onClick={() => post_blog()} className='hover:bg-black transition shadow-md rounded-lg py-2 px-5 w-full bg-green-600 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none' >
                        {postLoading ? <CircularProgress sx={{ width: "1.2rem !important", height: "1.2rem !important", color: "#fff" }} />
                            : <p>Post</p>}
                    </button>
                </div>

            </main>
        </>
    )
}

export default Write