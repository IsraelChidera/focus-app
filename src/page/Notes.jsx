import React, { useEffect, useRef, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import { collection, query, where, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import moment from 'moment/moment';


import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Notes = () => {

  const [openSearchNotes, setOpenSearchNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
  const [data, setData] = useState([]);

  const handleOpenSearchTab = () => {
    setOpenSearchNotes(prevState => !prevState);
  }

  const handleAddNotesToDb = async () => {
    if (notes.trim() === "") {
      setError("Notes cannot be empty.");
      return;
    }


    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "notes"), {
        notes: notes,
        uid: user,
        dateCreated: moment().format("MMM Do YY")
      });

      setLoading(false);
      setNotes("");

     

    } catch (error) {
      console.error("Error adding document:", error);
      setError("Error adding the note.");
    }

  }

  const fetchData = async () => {
    try {
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


  return (
    <section className="text-white mt-10 mb-20 px-3 md:px-0">
      {
        openSearchNotes && <form className='mb-6 w-full relative'>
          <input
            type='search'
            placeholder='Search ...'
            className='text-secondary w-1/2 text-sm'
          />
        </form>
      }


      <div className='bg-sidebar'>

        <div className='bg-sidebar px-4 py-2 flex justify-between items-center'>

          <BsPlusLg className='text-white' />

          <FiSearch className='text-white' onClick={handleOpenSearchTab} />

        </div>


        <div>
          {error && <p style={{ color: "red" }} className='text-red-600 text-sm'>{error}</p>}
          <form>

            <div >
              <CKEditor
                editor={ClassicEditor}
                data={notes}
                className='w-full bg-sidebar text-sm'
                onReady={editor => {
                  // You can store the "editor" and use when it is needed.
                  console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setNotes(data);
                }}
                onBlur={(event, editor) => {
                }}
                onFocus={(event, editor) => {
                }}
              />
            </div>

          </form>
        </div>
      </div>

      <div className='flex justify-end py-2'>
        <button
          type="submit"
          onClick={handleAddNotesToDb}
          className="px-6 py-2 text-xs text-white bg-sidebar"
        >
          {loading ? "Adding note . . ." : "Add note"}
        </button>
      </div>

      <div className='mt-16 grid grid-container gap-x-4 gap-y-6 '>
        {
          data.length == 0 && <div>
            <p>
              You have no notes
            </p>
          </div>
        }

        {
          data.map((note) => (
            <NavLink to={`/notes/${note.id}`} className='relative todo-weekly rounded-lg shadow-md' key={note.id}>
              <p style={{ fontSize: "10px" }} className='text-right px-2'>
                {note.dateCreated}
              </p>
              <div className='pt-2 border-b border-sidebar'></div>

              {note.notes.length >= 257 ? <div
                style={{ wordWrap: "break-word" }} className='p-2 text-xs'
                dangerouslySetInnerHTML={{ __html: note.notes.substring(0, 257) + " . . ." }}
              /> : <div
                style={{ wordWrap: "break-word" }} className='p-2 text-xs'
                dangerouslySetInnerHTML={{ __html: note.notes }}
              />}

              <div>

              </div>
            </NavLink>
          ))
        }


      </div>
    </section>
  )
}

export default Notes