import {FC} from "react";

interface AvatarProps {
    src: string,
    nickname?: string
    unreadCount?: number
    onClick?: () => void
}

export const Avatar: FC<AvatarProps> = (props) => {
    return <div onClick={props.onClick}
                style={{display: 'inline-flex', cursor: 'pointer', alignItems: 'center'}}>
        <div style={{position: 'relative'}}>
            <img style={{border: '1px solid #ccc', width: '40px', height: '40px', borderRadius: '20px'}}
                 src={props.src}/>
            {
                props.unreadCount && <span style={{
                    backgroundColor: 'red',
                    padding: '0 2px',
                    color: '#fff',
                    fontSize: '12px',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    transform: 'translate(50%,-50%)'
                }}>{props.unreadCount}</span>
            }
        </div>
        {
            props.nickname && <p style={{marginLeft: '10px'}}>{props.nickname}</p>
        }

    </div>
}