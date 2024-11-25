
import { title, subtitle } from "@/components/primitives";

import DefaultLayout from "@/layouts/default";
import {Button} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import {useUserStore} from "@/store/useUserStore";
import {useEffect} from "react";

export default function IndexPage() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useUserStore();

function logout() {
  setIsLoggedIn(false);
  navigate("/");
}
  useEffect(()=>{
    if(!isLoggedIn){
      navigate("/auth");
    }
  },[isLoggedIn, navigate])
return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Button
            className="absolute top-4 right-4"
            color="danger"
            variant="bordered"
            onClick={logout}
        >
          Logout
        </Button>
        <div className="inline-block text-center justify-center">
          <span className={title()}>Welcome to the application.&nbsp;</span>
          <br/>
          <span className={title({ color: "violet" })}>Easy Generator&nbsp;</span>
          <br />
          <div className={subtitle({ class: "mt-4" })}>
            AI-powered e-learning creation tool for enterprises
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
