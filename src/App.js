import React,{useRef, useEffect} from 'react';

import './App.css';

import Navigation from "./navigation.component";
import {ButtonGroup, Button} from '@material-ui/core'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  canvas: {
    border: "2px solid black",
  },
  inputFile: {
    display: "none",
  },
}));



function App() {
  const myInput = useRef(null);
  let selectedTool = ''
  let drawnLines = []
  let currX =0
  let currY =0
  // let prevX =0
  // let prevY =0
  let lineClicks = []
  function handleMouseDown() {
    console.log(`Il tool corrente è ${selectedTool}`)

    switch (selectedTool) {
      case 'linea':
        return handleLineClick()
      default:
        console.log("Seleziona un tool")
        break
    }
  }
  function findxy(res, e) {
    const canvas = document.getElementById('can');
    // prevX = currX;
    // prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;
  }
  function init() {
    const canvas = document.getElementById('can');
    // const ctx = canvas.getContext("2d");
    // const w = canvas.width;
    // const h = canvas.height;

    canvas.addEventListener("mousemove", function (e) {
      findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
      console.log('mousedown')
      findxy('down', e)
      handleMouseDown()
    }, false);
    canvas.addEventListener("mouseup", function (e) {
      findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
      findxy('out', e)
    }, false);
  }
  
  function handleLineClick() {
    lineClicks.push({ x: currX, y: currY })
    console.log('i riferimenti di linea', lineClicks)
    if (lineClicks.length === 2) {
      console.log('Abbiamo i punti, disegnamo')
      const canvas = document.getElementById('can');
      const ctx = canvas.getContext('2d');

      ctx.beginPath();       // Start a new path
      ctx.moveTo(lineClicks[0].x, lineClicks[0].y);    // Move the pen to (30, 50)
      ctx.lineTo(lineClicks[1].x, lineClicks[1].y);  // Draw a line to (150, 100)
      ctx.stroke();
      drawnLines.push(lineClicks)
      lineClicks = []
    }
  }
  function chooseFile() {
    myInput.current.click()
  }
  function selectLineTool() {
    selectedTool = 'linea'
    console.log("Entriamo in modalità linea")
  }
  function handleFileSelected(evt) {
    const ctx = document.querySelector("#can").getContext("2d");
    console.log("File changed",evt.target.files)
    const FR = new FileReader();
    FR.addEventListener("load", (evt) => {
      console.log('load')
      const img = new Image();
      img.addEventListener("load", () => {
        console.log('Image loaded')
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
      });
      img.src = evt.target.result;
    });
    FR.readAsDataURL(evt.target.files[0]);
  }
  const classes = useStyles()

  useEffect(() => {
    init()
  });

  return (
    <div className="App">
      <Navigation></Navigation>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>

          <input type="file" 
            id="fileSelector" 
            className={classes.inputFile} 
            onChange={handleFileSelected}
            ref={myInput}></input>
          <ButtonGroup color="primary" aria-label="contained primary button group">
            <Button onClick={chooseFile}>Scegli file</Button>
            <Button onClick={selectLineTool}>Linea</Button>
            {/* <Button>Area</Button> */}
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} sm={6}>
          <canvas id="can" width="600" height="600" className={classes.canvas}></canvas>
        </Grid>
      </Grid>
      
    </div>
  );
}

export default App;
