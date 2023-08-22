import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { collection, query, where, doc, updateDoc, deleteField, getDocs, deleteDoc } from "firebase/firestore";
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AiFillDelete } from 'react-icons/ai';
import { BsPencilSquare } from 'react-icons/bs';
import { BiArrowBack } from 'react-icons/bi';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const NoteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();


    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState("");
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState();

    const fetchData = async () => {
        try {
            // const querySnapshot = await getDocs(collection(db, "notes"), where("uid", "==", user));
            setLoading(true);
            const q = query(collection(db, "notes"), where("uid", "==", user));
            const querySnapshot = await getDocs(q);
            const fetchedData = [];
            querySnapshot.forEach((doc) => {
                setLoading(false);
                fetchedData.push({ id: doc.id, ...doc.data() });
            });

            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    const handleDeleteNote = async () => {
        try {
            await deleteDoc(doc(db, "notes", id));
            navigate(-1);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }

    const note = data.find(item => item.id === id);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUser(uid);
            } else {
                console.log("Wahala de");
            }
        });

    }, [user])

    useEffect(() => {
        fetchData();
    }, [user, notes])


    const onEdit = () => {
        setOpen(prev => !prev)
    }

    const onUpdateNotes = async () => {
        setOpen(prev => !prev);

        const updateRef = doc(db, "notes", note.id);
        
        await updateDoc(updateRef, {
            notes : notes
        })

        navigate("/notes");
    }

    if (!note) {
        return (
            <div className='mt-6'>
                <p className='text-white'>
                    Note not found. <NavLink to="/notes"
                        className='text-sm underline'
                    >return to notes</NavLink >
                </p>
            </div>
        )
    }

    return (
        <>
            {
                open ? <>
                    <form className='mt-10'>

                        <div >
                            <CKEditor
                                editor={ClassicEditor}
                                data={note.notes}
                                className='w-full bg-sidebar text-sm'
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.                                    
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    // console.log({ event, editor, data });
                                    setNotes(data);
                                }}
                                onBlur={(event, editor) => {
                                }}
                                onFocus={(event, editor) => {
                                }}
                            />
                        </div>

                        <div className='flex justify-end'>
                            <button className='px-6 py-2 text-xs text-white bg-sidebar mt-4' onClick={onUpdateNotes}>
                                Update
                            </button>
                        </div>

                    </form>
                </> : <>
                    <div className='mt-10 text-white px-3 md:px-0'>
                        <h3 className='pb-1'>Note detail</h3>
                        <div className='flex justify-between items-center border-t border-secondary pt-2 text-right text-xs'>
                            <p className='text-lg '><BiArrowBack className='cursor-pointer' onClick={() => navigate(-1)} /></p>
                            <p style={{ fontSize: "12px" }} >
                                {note.dateCreated}
                            </p>
                        </div>
                        <div className='text-sm mt-8'>
                            <div
                                dangerouslySetInnerHTML={{ __html: note.notes }}
                            />
                        </div>

                        <div className='flex justify-center space-x-4 text-lg mt-20'>
                            <BsPencilSquare onClick={onEdit} className='cursor-pointer' />
                            <AiFillDelete className='cursor-pointer' onClick={handleDeleteNote} />

                        </div>
                    </div>
                </>
            }


        </>
    )
}

export default NoteDetail