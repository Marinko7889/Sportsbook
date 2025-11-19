"use client";

import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";

export default function PageWrapper({ children, BASE_URL }) {
  // const router = useRouter();
  // const pathname = usePathname();

  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [checkingAuth, setCheckingAuth] = useState(true);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const res = await fetch(`${BASE_URL}/auth/me`, {
  //         credentials: "include",
  //       });

  //       if (!res.ok) {
  //         setIsAuthenticated(false);
  //         router.push("/login");
  //       } else {
  //         const data = await res.json();
  //         setIsAuthenticated(true);
  //         console.log("Ulogiran");
  //         console.log(data);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       setIsAuthenticated(false);
  //       router.push("/login");
  //     } finally {
  //       setCheckingAuth(false);
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  // // useEffect(() => {
  // //   if (pathname === "/teams") setActive("teams");
  // //   else if (pathname === "/vjezba") setActive("vjezba");
  // //   else if (pathname === "/competition") setActive("competitions");
  // //   else if (pathname === "/vjezba22") setActive("Vjezba22");
  // // }, [pathname]);

  // if (checkingAuth) {
  //   return <Spinner />;
  // }

  // if (!isAuthenticated) {
  //   router.push(`/login`);

  //   return null;
  // }

  // const handleActiveChange = (value) => {
  //   //setActive(value);
  //   router.push(`/${value}`);
  // };

  return (
    // <QueryClientProvider client={queryClient}>
    <div className="flex min-h-screen">
      <Sidebar BASE_URL={BASE_URL} />
      <main className="flex-1 p-8 ml-64 overflow-x-auto;">
        {children} <Toaster position="top-center" />
      </main>
    </div>
    // </QueryClientProvider>
  );
}
