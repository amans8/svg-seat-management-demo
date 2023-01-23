import React, { useEffect, useLayoutEffect, useState } from "react";
import { ReactSVG } from "react-svg";
import { fabric } from "fabric";

function App() {
  const [width, height] = useWindowSize();
  const [file, setFile] = useState(null);

  const [dimensions, setDimensions] = useState(null);

  const [positionRatios, setPositionRatios] = useState([]);

  const handleImageSelect = (e) => {
    if (e.target.files) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    loadQuarters();
  }, [height, width]);

  let canvas;

  const loadQuarters = () => {
    if (canvas) canvas.dispose();
    const svg = document.getElementsByTagName("svg")[0];
    if (!svg) return;
    const svgHeight = svg.getBoundingClientRect().height;
    const svgWidth = svg.getBoundingClientRect().width;
    const svgX = svg.getBoundingClientRect().x;
    const svgY = svg.getBoundingClientRect().y;
    if (svgHeight === 0 || svgWidth === 0) return;
    //save dimensions for canvas
    setDimensions({ height: svgHeight, width: svgWidth });
    canvas = new fabric.Canvas("canvas", {
      height: svgHeight,
      width: svgWidth,
    });
    // fabric.Image.fromURL("https://i.ibb.co/RHJg7Mv/seatt.png", function (oImg) {
    //   oImg.scale(0.05);
    //   canvas.add(
    //     oImg.set({
    //       left: 40,
    //       top: 40,
    //     }),
    //   );
    // });

    const quarters = svg.querySelectorAll(
      'path[d="m1308.2 218.79a42.668 42.668 0 0 1 41.07 -42.638l1.5989 42.638z"]',
    );

    for (const quarter of quarters) {
      fabric.Image.fromURL(
        "https://i.ibb.co/RHJg7Mv/seatt.png",
        function (oImg) {
          oImg.scale(0.08);
          canvas.add(
            oImg.set({
              left: quarter.getBoundingClientRect().x - svgX,
              top: quarter.getBoundingClientRect().y - svgY,
            }),
          );
          oImg.bringToFront();
        },
      );
    }

    // const positionRatiosArray = [];
    // for (const quarter of quarters) {
    //   const quarterPositionXRatio =
    //     (quarter.getBoundingClientRect().x - svgX) / svgWidth;
    //   const quarterPositionYRatio =
    //     (quarter.getBoundingClientRect().y - svgY) / svgHeight;
    //   positionRatiosArray.push({
    //     x: quarterPositionXRatio,
    //     y: quarterPositionYRatio,
    //     height: quarter.getBoundingClientRect().height,
    //     width: quarter.getBoundingClientRect().width,
    //   });
    // }
    // setPositionRatios(positionRatiosArray);
  };

  return (
    <div>
      <input type="file" onChange={handleImageSelect} />
      <button onClick={loadQuarters}>Load Quarters</button>
      <br />
      <br />

      {file && (
        <div className="container">
          <div className="canvas-container">
            <canvas id="canvas"></canvas>
            {/* <div
              style={{ height: dimensions?.height, width: dimensions?.width }}
              className="canvas"
            >
              {positionRatios &&
                positionRatios?.length > 0 &&
                positionRatios.map((positionRatio, index) => (
                  <div
                    key={index}
                    className="quarter"
                    style={{
                      top: positionRatio.y * dimensions.height,
                      left: positionRatio.x * dimensions.width,
                      height: positionRatio.height + "px",
                      width: positionRatio.width + "px",
                    }}
                  >
                    <div className="marker"></div>
                  </div>
                ))}
            </div> */}
          </div>
          <div className="svg-container">
            <ReactSVG src={file} alt="SVG Preview" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}
