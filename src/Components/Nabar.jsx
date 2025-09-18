import houseImg from "../assets/Images/house.png";
import applicationImg from "../assets/Images/applicant.png";
import BookImg from "../assets/Images/books.png";
import AboutImg from "../assets/Images/about.png";
import "../App.css";
function Nabar() {
  return (
    <nav className="w-full flex items-center justify-center text-white rounded sticky shadow bg-gray-100 sm:my-1 sm:p-4 p-1 glass">
  <div className="flex w-full justify-evenly items-center sm:p-4 p-1 py-4">
    <h1 className="sm:pr-10 pr-[5px] pr-auto sm:text-2xl text-xs">University</h1>
    <ul className="flex sm:gap-2 lg:gap-5 gap-1 lg:text-[25px] text-xs items-center khmerFont text-white">
      <li className="flex items-center gap-1">
        <img src={houseImg} alt="Home" className="lg:w-8 w-4" />
        <span className=" cursor-pointer">ទំព័រដើម</span>
      </li>
      <li className="flex items-center gap-1">
        <img src={applicationImg} alt="Home" className="lg:w-8 w-4" />
        <span className=" cursor-pointer">ការចុះឈ្មោះ</span>
      </li>
      <li className="flex items-center gap-1">
        <img src={BookImg} alt="Home" className="lg:w-8 w-4" />
        <span className=" cursor-pointer">កម្មវិធីសិក្សា</span>
      </li>
      <li className="flex items-center gap-1">
        <img src={AboutImg} alt="Home" className="lg:w-8 w-4" />
        <span className=" cursor-pointer">អំពីយើង</span>
      </li>
    </ul>
    <button className="glass ml-auto text-white hidden sm:block sm:px-4 sm:py-1 rounded cursor-pointer">
      Login
    </button>
  </div>
</nav>
  );
}
export default Nabar;
