import { CardSwiper } from "react-card-swiper";
import ReactSvg from "./assets/react.svg";

const Content = () => <h1>Lorem ipsum dolor sit amet.</h1>;

function App() {
  const mockData = [
    {
      id: "88552078",
      meta: { apk: "some-apk-a.apk" },
      src: "https://i.seadn.io/gae/j9fZd-_CTm_AOL-AsAvwHIW57SyKQdB_amN-kgbD_TH2O1pehgvtLMOvWc9bKq-WgEzhYQ_WDOHnyib1KV9slyIXUGmRrQSInN7fZbw?w=1000&auto=format",
      content: <Content />,
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "300px", height: "500px" }}>
        <CardSwiper data={mockData} emptyState={<div>Empty State</div>} />
      </div>
    </div>
  );
}

export default App;
