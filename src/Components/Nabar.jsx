import houseImg from "../assets/Images/house.png";

function Nabar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 rounded">
      <h1 className="text-gray-600 text-xl font-bold">University</h1>

      <ul className="flex gap-5 text-sm items-center">
        <li className="flex items-end gap-1">
          <img src={houseImg} alt="Home" className="w-7 h-7" />
           <span>ទំព័រដើម</span>
        </li>
        <li>ការចុះឈ្មោះ</li>
        <li>កម្មវិធីសិក្សា</li>
        <li>អំពីយើង</li>
      </ul>

      <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
        Login
      </button>
    </nav>
  );
}

export default Nabar;
