import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Nabar from "./Components/Nabar";
import MainRouter from "./Router/mainRouter";
import { Footer } from "./Components/Footer";
import "./App.css";
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ["/adminsidebar", "/registration","/Login"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Nabar />
      </div>
      <div className="relative w-auto h-auto py-1 px-4 sm:pt-15 pt-13">
        <MainRouter />
      </div>
      {!shouldHideFooter && (
        <div className="px-4 rounded pb-2">
          <Footer />
        </div>
      )}
    </>
  );
}
export default App;
