import React from 'react'

export default function Detail(props) {
    return (
        <div>
            用户详情 {props.match.params.id}
        </div>
    )
}
