import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {LoginOutlined, LogoutOutlined} from "@ant-design/icons";
import {FloatButton} from "antd";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      <form action={signOut}>
        <button >
          <FloatButton description="Déconnexion" shape="square"
                       style={{insetInlineEnd: 24 , width:100 , padding:10}}
                       icon={<LogoutOutlined/>}/>
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      <FloatButton description="Connexion" shape="square"
                   style={{insetInlineEnd: 24 , width:100 , padding:10}}
                   icon={<LoginOutlined/>}/>
    </Link>
  );
}
