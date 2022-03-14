import {FC, useState} from "react";

interface IProps {
    onEnter: (inputVal:string) => void
}

export const ChatBox: FC<IProps> = (props) => {
    return <div style={{padding: '10px'}}>
        <textarea
            placeholder={'输入消息后按Enter键发送'} onKeyDown={e => {
            if (e.key === 'Enter') {
                props.onEnter((e.target as any).value);
            }
        }} onKeyUp={(e) => {
            if (e.key === 'Enter') {
                (e.target as any).value = ''
            }
        }} style={{ width:'100%' }} rows={10}/>
    </div>
}