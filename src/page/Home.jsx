import WelcomeImg from "../assets/Images/Welcome.png";
import IntroductionImg from "../assets/Images/Introduction.png";
import BackGrpundImg from "../assets/Images/Background.png";
const Home = () => {
    return (
        <section className="w-full rounded bg-gray-100 relative overflow-hidden bodyglass">
           <div  className="w-full sm:p-3 p-1"> 
            <img src={BackGrpundImg} className="w-full rounded" alt=""/>
           </div>
        </section>
    );
};
export default Home;