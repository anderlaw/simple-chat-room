import {StreamChat} from "stream-chat";
import {API_KEY, API_SECRET} from "../config/key";
export default (() => {
    let serverSideClient: StreamChat | null = null;
    return ():StreamChat => {
        return serverSideClient || (serverSideClient = new StreamChat(API_KEY, API_SECRET))
    }
})()