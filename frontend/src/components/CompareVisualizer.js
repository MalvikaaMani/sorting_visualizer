// src/components/CompareVisualizer.js
import React, { useEffect, useState, useRef } from "react";
import {
  mergeSortSteps,
  quickSortSteps,
  heapSortSteps,
  insertionSortSteps,
  bubbleSortSteps,
  selectionSortSteps,
} from "../utils/sortingAlgorithms";
import "./../styles/Visualizer.css";

const algorithms = [
  { id: "merge", name: "Merge Sort" },
  { id: "quick", name: "Quick Sort" },
  { id: "heap", name: "Heap Sort" },
  { id: "insertion", name: "Insertion Sort" },
  { id: "bubble", name: "Bubble Sort" },
  { id: "selection", name: "Selection Sort" },
];

// Complexity information
const complexities = {
  merge: {
    time: "Best O(n log n), Avg O(n log n), Worst O(n log n)",
    space: "O(n)",
  },
  quick: {
    time: "Best O(n log n), Avg O(n log n), Worst O(n²)",
    space: "O(log n)",
  },
  heap: {
    time: "Best O(n log n), Avg O(n log n), Worst O(n log n)",
    space: "O(1)",
  },
  insertion: {
    time: "Best O(n), Avg O(n²), Worst O(n²)",
    space: "O(1)",
  },
  bubble: {
    time: "Best O(n), Avg O(n²), Worst O(n²)",
    space: "O(1)",
  },
  selection: {
    time: "Best O(n²), Avg O(n²), Worst O(n²)",
    space: "O(1)",
  },
};

const CompareVisualizer = () => {
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    resetArray();
    return () => clearInterval(intervalRef.current);
  }, []);

  const resetArray = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const arr = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 90 + 10)
    );
    setArray(arr);
    setSteps({});
    setCurrentStep(0);
  };

  const prepareSteps = () => {
    const s = {
      merge: mergeSortSteps(array),
      quick: quickSortSteps(array),
      heap: heapSortSteps(array),
      insertion: insertionSortSteps(array),
      bubble: bubbleSortSteps(array),
      selection: selectionSortSteps(array),
    };
    setSteps(s);
    setCurrentStep(0);
    return s;
  };

  const getMaxStepCount = (sObj) => {
    const lengths = Object.values(sObj || steps).map((s) => (s ? s.length : 0));
    return lengths.length ? Math.max(...lengths) : 0;
  };

  const nextStep = () => {
    let sObj = steps;
    if (Object.keys(steps).length === 0) {
      sObj = prepareSteps();
      const maxLen = getMaxStepCount(sObj);
      if (maxLen > 0) setCurrentStep(1);
      return;
    }

    const maxLen = getMaxStepCount(sObj);
    setCurrentStep((prev) => {
      if (prev >= maxLen) return prev;
      return prev + 1;
    });
  };

  const runAll = () => {
    let sObj = steps;
    if (Object.keys(steps).length === 0) {
      sObj = prepareSteps();
    }
    const maxLen = getMaxStepCount(sObj);
    if (maxLen === 0) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= maxLen) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return prev;
        }
        return prev + 1;
      });
    }, 350);
  };

  const stopSorting = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const renderBarsForAlgo = (algoId) => {
    const algoSteps = steps[algoId] || [];
    let stepToShow;

    if (currentStep === 0) {
      stepToShow = { array, highlight: [], explanation: "Initial array" };
    } else {
      if (algoSteps.length >= currentStep) {
        stepToShow = algoSteps[currentStep - 1];
      } else if (algoSteps.length > 0) {
        stepToShow = algoSteps[algoSteps.length - 1];
      } else {
        stepToShow = { array, highlight: [], explanation: "Initial array" };
      }
    }

    const arr = stepToShow.array || array;
    const highlight = stepToShow.highlight || [];

    return (
      <>
        <div className="bars-container">
          {arr.map((value, i) => (
            <div className="bar-wrapper" key={i}>
              <div
                className={`bar ${highlight.includes(i) ? "highlight" : ""}`}
                style={{ height: `${value * 2.2}px` }}
              />
              <div className="bar-value">{value}</div>
            </div>
          ))}
        </div>
        <p className="step-explanation">{stepToShow.explanation}</p>
        <div className="complexity-panel">
          <strong>Time:</strong> {complexities[algoId].time} <br />
          <strong>Space:</strong> {complexities[algoId].space}
        </div>
      </>
    );
  };

  const maxLen = getMaxStepCount(steps);

  return (
    <div className="visualizer-container">
      <h2>Compare Sorting Algorithms</h2>

      <div className="input-array" style={{ marginBottom: 8 }}>
        <strong>Input Array:</strong> {array.join(", ")}
      </div>

      <div className="algo-display-card">
        <div className="algo-grid">
          {algorithms.map((algo) => (
            <div className="algo-box" key={algo.id}>
              <h3>{algo.name}</h3>
              {renderBarsForAlgo(algo.id)}
            </div>
          ))}
        </div>
      </div>

      <div className="controls" style={{ marginTop: 12 }}>
        <button onClick={resetArray}>🔄 Reset Array</button>
        <button onClick={prepareSteps}>📑 Prepare Steps</button>
        <button onClick={nextStep} disabled={currentStep >= maxLen}>
          👉 Next Step
        </button>
        <button onClick={runAll} disabled={maxLen === 0}>
          ▶ Run All
        </button>
        <button onClick={stopSorting}>⏸ Stop</button>
        <button onClick={() => setCurrentStep(0)} disabled={currentStep === 0}>
          🔁 Replay
        </button>
      </div>
    </div>
  );
};

export default CompareVisualizer;
