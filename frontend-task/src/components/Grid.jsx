import React, { useState } from 'react'

const Grid = () => {

    const rows = 8;
    const cols = 8;
    const [selctedCol, setselctedCol] = useState()

    return (
        <div className='position-absolute top-50 start-50 translate-middle text-center'>
            <table className="table table-bordered">
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: cols }).map((_, colIndex) => (
                                <td
                                    key={colIndex}
                                    style={{
                                        backgroundColor: selctedCol && (selctedCol.colIndex === colIndex && selctedCol.rowIndex === rowIndex) ? 'red' : (rowIndex + colIndex) % 2 === 0 ? 'black' : 'white',
                                        padding: "2rem",
                                        cursor:'pointer'
                                    }}
                                    onClick={() => setselctedCol({ colIndex, rowIndex })}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className='btn btn-outline-danger' onClick={() => setselctedCol()} >Reset</button>
        </div>
    )
}

export default Grid