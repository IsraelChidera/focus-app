import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const NoteDetail = () => {
    const { id } = useParams();

    const [data, setData] = useState([]);


    return (
        <div>NoteDetail</div>
    )
}

export default NoteDetail