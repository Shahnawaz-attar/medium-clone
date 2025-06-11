import type { NextPage } from "next";
import Head from "next/head";
import Header from '../components/Header'
import PostCard from '../components/PostCard'
import Footer from '../components/Footer'
import { sanityClient } from '../sanity'
import { Posts } from "../typing";

interface Props {
  posts: [Posts];
}

const Home = ({ posts }: Props) => {
  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <div className='flex justify-between items-center bg-yellow-400 border-y border-black  py-10 lg:py-5  '>
        <div className='px-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'>
            <span className='underline decoration-black decoration-4'>
              Medium
            </span>{" "}
            is a place to write ,read , and connect
          </h1>
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, eos,
            dolorem nam atque laboriosam nemo nisi
          </h2>
        </div>
        <div className='pr-5'>
          <img
            className='hidden md:inline-flex h-32 lg:h-48'
            src='http://cdn.onlinewebfonts.com/svg/img_256332.png'
            alt=''
          />
        </div>
      </div>

      {/* post */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mt-5 p-2 md:p-6'>
        {posts.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    title,
      _id,
      author ->{
        name,
        slug,
        image
      },
      description,
      mainImage,
      slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};

export default Home;
