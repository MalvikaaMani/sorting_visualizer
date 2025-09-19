// Insertion Sort
export const insertionSortSteps = (arr) => {
  let steps = [];
  let a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;
    steps.push({
      array: [...a],
      highlight: [i],
      explanation: `Picked ${key} for insertion`
    });

    while (j >= 0 && a[j] > key) {
      steps.push({
        array: [...a],
        highlight: [j, j + 1],
        explanation: `Comparing ${a[j]} and ${key} → shifting ${a[j]}`
      });
      a[j + 1] = a[j];
      j = j - 1;
    }

    a[j + 1] = key;
    steps.push({
      array: [...a],
      highlight: [j + 1],
      explanation: `Placed ${key} at position ${j + 1}`
    });
  }
  steps.push({ array: [...a], highlight: [], explanation: "Array fully sorted ✅" });
  return steps;
};

// Merge Sort
export const mergeSortSteps = (arr) => {
  let steps = [];
  let a = [...arr];

  const mergeSort = (left, right) => {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  };

  const merge = (left, mid, right) => {
    let i = left, j = mid + 1;
    let temp = [];

    while (i <= mid && j <= right) {
      if (a[i] <= a[j]) {
        steps.push({
          array: [...a],
          highlight: [i, j],
          explanation: `Comparing ${a[i]} and ${a[j]} → ${a[i]} is smaller`
        });
        temp.push(a[i++]);
      } else {
        steps.push({
          array: [...a],
          highlight: [i, j],
          explanation: `Comparing ${a[i]} and ${a[j]} → ${a[j]} is smaller`
        });
        temp.push(a[j++]);
      }
    }
    while (i <= mid) temp.push(a[i++]);
    while (j <= right) temp.push(a[j++]);

    for (let k = 0; k < temp.length; k++) {
      a[left + k] = temp[k];
      steps.push({
        array: [...a],
        highlight: [left + k],
        explanation: `Placed ${temp[k]} at position ${left + k}`
      });
    }
  };

  mergeSort(0, a.length - 1);
  steps.push({ array: [...a], highlight: [], explanation: "Array fully sorted ✅" });
  return steps;
};

// Quick Sort
export const quickSortSteps = (arr) => {
  let steps = [];
  let a = [...arr];

  const swap = (i, j) => {
    [a[i], a[j]] = [a[j], a[i]];
    steps.push({
      array: [...a],
      highlight: [i, j],
      explanation: `Swapped ${a[j]} and ${a[i]}`
    });
  };

  const partition = (low, high) => {
    let pivot = a[high];
    steps.push({
      array: [...a],
      highlight: [high],
      explanation: `Chose pivot = ${pivot}`
    });
    let i = low;
    for (let j = low; j < high; j++) {
      steps.push({
        array: [...a],
        highlight: [j, high],
        explanation: `Comparing ${a[j]} with pivot ${pivot}`
      });
      if (a[j] < pivot) {
        swap(i, j);
        i++;
      }
    }
    swap(i, high);
    return i;
  };

  const quickSort = (low, high) => {
    if (low < high) {
      let pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  };

  quickSort(0, a.length - 1);
  steps.push({ array: [...a], highlight: [], explanation: "Array fully sorted ✅" });
  return steps;
};

// Heap Sort
export const heapSortSteps = (arr) => {
  let steps = [];
  let a = [...arr];

  const heapify = (n, i) => {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      steps.push({
        array: [...a],
        highlight: [i, largest],
        explanation: `Swapped ${a[largest]} with ${a[i]} to maintain heap`
      });
      heapify(n, largest);
    }
  };

  let n = a.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
    steps.push({
      array: [...a],
      highlight: [i],
      explanation: `Heapified subtree rooted at index ${i}`
    });
  }

  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    steps.push({
      array: [...a],
      highlight: [0, i],
      explanation: `Moved max element ${a[i]} to sorted part`
    });
    heapify(i, 0);
  }
  steps.push({ array: [...a], highlight: [], explanation: "Array fully sorted ✅" });
  return steps;
};

// Bubble Sort
export function bubbleSortSteps(arr) {
  const a = [...arr];
  const steps = [];

  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({
        array: [...a],
        highlight: [j, j + 1],
        explanation: `Comparing ${a[j]} and ${a[j + 1]}`
      });

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({
          array: [...a],
          highlight: [j, j + 1],
          explanation: `Swapped ${a[j]} and ${a[j + 1]}`
        });
      }
    }
  }

  steps.push({ array: [...a], highlight: [], explanation: "Array fully sorted ✅" });
  return steps;
}

// Selection Sort
export function selectionSortSteps(arr) {
  const a = [...arr];
  const steps = [];

  for (let i = 0; i < a.length - 1; i++) {
    let minIndex = i;
    steps.push({
      array: [...a],
      highlight: [i],
      explanation: `Assume ${a[i]} as current minimum`
    });

    for (let j = i + 1; j < a.length; j++) {
      steps.push({
        array: [...a],
        highlight: [minIndex, j],
        explanation: `Comparing ${a[j]} with current min ${a[minIndex]}`
      });
      if (a[j] < a[minIndex]) {
        minIndex = j;
        steps.push({
          array: [...a],
          highlight: [minIndex],
          explanation: `Found new minimum ${a[minIndex]}`
        });
      }
    }

    if (minIndex !== i) {
      [a[i], a[minIndex]] = [a[minIndex], a[i]];
      steps.push({
        array: [...a],
        highlight: [i, minIndex],
        explanation: `Swapped ${a[i]} with ${a[minIndex]}`
      });
    }
  }

  steps.push({ array: [...a], highlight: [], explanation: "Array fully sorted ✅" });
  return steps;
}
