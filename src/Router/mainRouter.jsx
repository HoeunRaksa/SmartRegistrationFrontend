import MakaraRouter from "./makaraRouter";
import RaksaRouter from "./raksaRouter";
import MonyRouter from "./monyRouter";

const MainRouter = () => {
  return (
    <>
      <MakaraRouter />  {/* Only Routes */}
      <RaksaRouter />
      <MonyRouter />
    </>
  );
};

export default MainRouter;
