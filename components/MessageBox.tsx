import {FC, useState} from "react";
import {Avatar} from "./Avatar";

interface IProps {
    messageList: Array<{
        nickname: string,
        avatarSrc: string,
        isMyMessage: boolean,
        messageContent: string
    }>
}

export const MessageBox: FC<IProps> = (props) => {
    /**
     * 采用左右布局
     * `我的`消息放右侧
     * `其他人`的消息放左侧
     */
    return <div style={{padding: '30px'}}>
        {
            props.messageList.map((msgItem, idx) => {
                return <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '10px',
                    flexDirection: msgItem.isMyMessage ? 'row-reverse' : 'row'
                }}>
                    <Avatar src={msgItem.avatarSrc}/>
                    <div style={!msgItem.isMyMessage ? {marginLeft: '10px'} : {marginRight: '10px'}}>
                        <div style={{textAlign: msgItem.isMyMessage ? 'right' : 'left'}}>{msgItem.nickname}</div>
                        <div>{msgItem.messageContent}</div>
                    </div>
                </div>
            })
        }

    </div>
}