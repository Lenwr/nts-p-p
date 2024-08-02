import AuthButton from "../components/AuthButton";
import {createClient} from "@/utils/supabase/server";
import {CommentOutlined, CustomerServiceOutlined, LogoutOutlined} from '@ant-design/icons';
import {FloatButton} from 'antd';
import {Image} from "antd";

export default async function Index() {
    const canInitSupabaseClient = () => {
        // This function is just for the interactive tutorial.
        // Feel free to remove it once you have Supabase connected.
        try {
            createClient();
            return true;
        } catch (e) {
            return false;
        }
    };

    const isSupabaseConnected = canInitSupabaseClient();

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="btn btn-primary  w-full max-w-4xl flex justify-between items-center p-3 text-sm">
                    {isSupabaseConnected && <AuthButton/>}
                </div>
            </nav>

            <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3 shadow-2xl rounded-2xl">
                <Image src="https://i.pinimg.com/736x/be/1a/58/be1a5811534dc40ca46219a88a3412c4.jpg"/>
            </div>


            <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
                <p>
                    Powered by{" "}
                    <a
                        href=""
                        target="_blank"
                        className="font-bold hover:underline"
                        rel="noreferrer"
                    >
                        Jefferson
                    </a>
                </p>
            </footer>
        </div>
    );
}
