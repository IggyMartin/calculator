import React from "react";
import { nums } from './array'
import './Numbers.css'

export default function Numbers() {
    return (
        nums.map(el => {
            return (
            <button key={el.id} id={el.id} className={el.num === 0 ? "cero" : ""}>
                {el.num}
            </button>
            )
        })
    )
}