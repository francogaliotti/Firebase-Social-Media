import React from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { addDoc, collection } from 'firebase/firestore'
import { auth, db } from '../../config/Firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'

interface IFormInput {
    title: string;
    description: string;
}

const Form = () => {
    const navigate = useNavigate()
    const [user] = useAuthState(auth)
    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        description: yup.string().min(8).max(255).required("Description is required")
    })
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>({
        resolver: yupResolver(schema)
    })
    const postsRef = collection(db, "posts")
    const onCreatePost = async (data: IFormInput) => {
        await addDoc(postsRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid,
        });
        navigate('/');
    }
    return (
        <form onSubmit={handleSubmit(onCreatePost)}>
            <input type="text" placeholder='Title...' {...register("title")} />
            {<p style={{color: "red"}}>{errors.title?.message}</p>}
            <textarea placeholder='Description...' {...register("description")} />
            {<p style={{color: "red"}}>{errors.description?.message}</p>}
            <input type="submit" className="submitForm"/>
        </form>
    )
}

export default Form