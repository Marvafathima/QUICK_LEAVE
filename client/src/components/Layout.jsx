import { CustomNavbar } from "./CustomNavbar";
import { CustomFooter } from "./CustomFooter";

const Layout = ({ children }) => {
  return (
   
    <div className="flex min-h-screen flex-col">
      <CustomNavbar />
      <main className="flex-grow bg-gradient-to-b from-white to-green-300 px-4 py-12">
        <div className="mx-auto max-w-screen-md">{children}</div>
      </main>
      <CustomFooter />
    </div>
  );
};

export default Layout;
