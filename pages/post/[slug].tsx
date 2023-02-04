import { GetStaticProps } from "next";
import React from "react";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Posts } from "../../typing";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Posts;
}
const Post = ({ post }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    await fetch(`/api/createComment`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(res => {
        if (res.status === 200) {
          toast("Sumitted comment successfully", {
            type: "success",
          });
        }
        reset();
      })
      .catch(err => console.log(err));
  };

  return (
    <main className='pb-10'>
      <ToastContainer />;
      <Header />
      <img
        className='w-full h-40 object-cover'
        src={urlFor(post.mainImage).url()}
      />
      <article className='max-w-3xl mx-auto p-5'>
        <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
        <h2 className='text-xl font-light text-gray-500 mb-2'>
          {post.description}
        </h2>
        <div className='flex items-center space-x-2'>
          <img
            className='h-10 rounded-full '
            src={urlFor(post.author.image).url()}
            alt={post.author.name}
          />
          <p className='font-extralight text-sm'>
            Posted By <span className='text-green-600'>{post.author.name}</span>{" "}
            - Published at {new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>
      </article>
      <hr className='max-w-3xl my-5 border border-yellow-500 mx-auto' />
      <form
        className='flex flex-col p-5 max-w-2xl mx-auto mb-10'
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className='text-sm text-yellow-500'>Enjoyed Article Below</h3>
        <h4 className='text-3xl font-bold'>Please leave a comment below</h4>
        <hr className='py-3 mt-2' />

        <input {...register("_id")} type='hidden' name='_id' value={post._id} />

        <label htmlFor='' className='block mb-5 '>
          <span className='text-gray-700'>Name : </span>
          <input
            {...register("name", { required: true })}
            className=' border px-3 py-2 rounded block w-full outline-none focus:shadow-md form-input focus:ring-1'
            type={"text"}
            placeholder='Name Please'
          />
          {errors.name && (
            <span className='text-red-500'>The Name field is required</span>
          )}
        </label>
        <label htmlFor='' className='block mb-5 '>
          <span className='text-gray-700'>Email : </span>
          <input
            {...register("email", { required: true })}
            className=' border px-3 py-2 rounded block w-full outline-none shadow focus:shadow-md focus:ring-1'
            type={"email"}
            placeholder='Email Please'
          />
          {errors.email && (
            <span className='text-red-500'>The Email field is required</span>
          )}
        </label>
        <label htmlFor='' className='block mb-5 '>
          <span className='text-gray-700'>Comment : </span>
          <textarea
            {...register("comment", { required: true })}
            className=' border px-3 py-2 rounded block w-full outline-none focus:shadow-md focus:ring-1'
            placeholder='Leave you comment'
            rows={8}
          />
          {errors.comment && (
            <span className='text-red-500'>The Comment field is required</span>
          )}
        </label>

        <label htmlFor='' className='block mb-5'>
          <button className='text-blue-600 px-3 py-2 rounded border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-500  w-full'>
            Submit
          </button>
        </label>
      </form>
      {/* comments */}
      <div className='max-w-xl mx-auto bg-yellow-50 p-4'>
        <h3 className='text-2xl text-blue-500 mb-2'>Comments</h3>
        <hr />
        {post.comments.map(comment => (
          <div
            key={comment._id}
            className='flex justify-start space-x-2 items-center hover:bg-white p-3 rounded mb-3 my-2'
          >
            <p>{comment.comment}</p>
            <span className='text-xs text-blue-400'> ~ {comment.name}</span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug {
      current
    }
}`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Posts) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
      _id,
      author ->{
        name,
        slug,
        image
      },
      'comments' : *[
        _type == "comment" && post._ref == ^._id && approved == true
      ],
      description,
      mainImage,
      _createdAt,
      slug,
      body
  }`;

  const post = await sanityClient.fetch(query, { slug: params?.slug });
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
