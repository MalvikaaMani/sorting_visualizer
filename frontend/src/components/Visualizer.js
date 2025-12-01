// src/components/Visualizer.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  mergeSortSteps,
  quickSortSteps,
  heapSortSteps,
  insertionSortSteps,
  bubbleSortSteps,
  selectionSortSteps,
} from "../utils/sortingAlgorithms";
import "./../styles/Visualizer.css";

const complexities = {
  merge: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  quick: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
  heap: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
  insertion: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
  bubble: { best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
  selection: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)" },
};

const generateArray = (size = 10) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 10);

const Visualizer = () => {
  const { algoId } = useParams();
  const [array, setArray] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
  const [steps, setSteps] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    resetArray();
  }, [algoId]);

  const resetArray = () => {
    const newArray = generateArray();
    setArray(newArray);
    setOriginalArray(newArray);
    setSteps({});
    setCurrentStep(0);
  };

  const replay = () => {
    if (!originalArray.length) return;
    prepareSteps(originalArray);
  };

  const stopGame = () => {
    setArray(originalArray);
    setSteps({});
    setCurrentStep(0);
  };

  const prepareSteps = (arr = originalArray) => {
    if (algoId === "compare") {
      setSteps({
        merge: mergeSortSteps(arr),
        quick: quickSortSteps(arr),
        heap: heapSortSteps(arr),
        insertion: insertionSortSteps(arr),
        bubble: bubbleSortSteps(arr),
        selection: selectionSortSteps(arr),
      });
    } else {
      let s = [];
      if (algoId === "merge") s = mergeSortSteps(arr);
      else if (algoId === "quick") s = quickSortSteps(arr);
      else if (algoId === "heap") s = heapSortSteps(arr);
      else if (algoId === "insertion") s = insertionSortSteps(arr);
      else if (algoId === "selection") s = selectionSortSteps(arr);
      else if (algoId === "bubble") s = bubbleSortSteps(arr);
      setSteps({ [algoId]: s });
    }
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (algoId === "compare") {
      setCurrentStep((prev) => prev + 1);
    } else {
      if (currentStep < (steps[algoId]?.length || 0) - 1) {
        setArray(steps[algoId][currentStep].array);
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const renderBars = (step) => (
    <div className="bars-container">
      {step.array.map((val, idx) => (
        <div key={idx} className="bar-wrapper">
          <div
            className={`bar ${step.highlight?.includes(idx) ? "highlight" : ""}`}
            style={{ height: `${val * 3}px` }}
          ></div>
          <div className="bar-value">{val}</div>
        </div>
      ))}
    </div>
  );

  const currentExplanation =
    steps[algoId]?.[currentStep]?.explanation || "Click Prepare Steps to begin.";

  return (
    <div className="visualizer-container">
      <h1>
        {algoId === "compare"
          ? "Compare All Algorithms 🔀"
          : `${algoId?.toUpperCase()} Sort Interactive`}
      </h1>

      <div className="input-array">
        <strong>Input Array:</strong> {originalArray.join(", ")}
      </div>

      {algoId === "compare" ? (
        <div className="compare-grid">
          {Object.keys(steps).map((algo) => {
            const algoSteps = steps[algo] || [];
            const hasStep = currentStep < algoSteps.length;
            const stepToShow = hasStep
              ? algoSteps[currentStep]
              : algoSteps.length
              ? algoSteps[algoSteps.length - 1]
              : { array: originalArray, highlight: [], explanation: "" };

            return (
              <div key={algo} className="compare-card">
                <h3>{algo.toUpperCase()} Sort</h3>
                {renderBars(stepToShow)}
                <p className="explanation">{stepToShow.explanation}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {renderBars(
            currentStep < (steps[algoId]?.length || 0)
              ? steps[algoId][currentStep]
              : { array: originalArray, highlight: [] }
          )}
          <p className="explanation">{currentExplanation}</p>

          {/* Complexity Analysis Panel */}
          {algoId && algoId !== "compare" && complexities[algoId] && (
            <div className="complexity-panel">
              <h3>Complexity Analysis</h3>
              <p><strong>Best:</strong> {complexities[algoId].best}</p>
              <p><strong>Average:</strong> {complexities[algoId].avg}</p>
              <p><strong>Worst:</strong> {complexities[algoId].worst}</p>
              <p><strong>Space:</strong> {complexities[algoId].space}</p>
            </div>
          )}
        </>
      )}

      <div className="controls">
        <button onClick={resetArray}>🔄 New Array</button>
        <button onClick={() => prepareSteps()}>📑 Prepare Steps</button>
        <button
          onClick={nextStep}
          disabled={
            algoId === "compare"
              ? Object.values(steps).every(
                  (s) => currentStep >= (s?.length || 0) - 1
                )
              : currentStep >= (steps[algoId]?.length || 0) - 1
          }
        >
          👉 Next Step
        </button>
        <button onClick={replay} disabled={!steps || Object.keys(steps).length === 0}>
          🔁 Replay
        </button>
        <button onClick={stopGame} disabled={Object.keys(steps).length === 0}>
          🛑 Stop
        </button>
      </div>
    </div>
  );
};

export default Visualizer;
