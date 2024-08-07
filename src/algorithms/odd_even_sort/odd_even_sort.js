import {
  oddEvenSort_Columns_Parallel,
  oddEvenSort_Rows_Parallel,
} from "../odd_even_sort/parallel_odd_even";

function are2DArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const innerArr1 = arr1[i];
    const innerArr2 = arr2[i];

    if (innerArr1.length !== innerArr2.length) {
      return false;
    }

    for (let j = 0; j < innerArr1.length; j++) {
      if (innerArr1[j] !== innerArr2[j]) {
        return false;
      }
    }
  }

  return true;
}

async function shearsort(grid, random_or_own) {
  let numRows = grid.length;
  let oddPhases = Math.log(numRows) / Math.log(2) + 1; //rows
  let evenPhases = Math.log(numRows) / Math.log(2); //columns
  let Phases = Math.round(oddPhases + evenPhases);

  //console.log(array);

  let sortedPhase;

  let rows_phase;
  let columns_phase;

  for (let i = 0; i < Phases; i++) {
    if (i % 2 === 0) {
      // xrisimopoioume ta dirtyrows gia na epeksergazomaste kathe fora
      //tis grammes poy den einai sortarismenes
      let dirtyRows;

      if (i === 0) {
        dirtyRows = [...grid];
      } else {
        dirtyRows = grid.filter((row) => row.includes(0) && row.includes(1));
      }

      const index = grid.indexOf(dirtyRows[0]);

      rows_phase = await oddEvenSort_Rows_Parallel(dirtyRows, index);
      sortedPhase = [...rows_phase];
    } else {
      columns_phase = await oddEvenSort_Columns_Parallel(sortedPhase);

      sortedPhase = [...columns_phase];
    }

    let dirtyIndex = 0;
    let resultGrid = [];
    for (let j = 0; j < grid.length; j++) {
      if ((grid[j].includes(0) && grid[j].includes(1)) || i < 2) {
        // Αν η γραμμή είναι dirty, προσθέτει την ταξινομημένη dirty γραμμή
        resultGrid.push(sortedPhase[dirtyIndex]);
        dirtyIndex++;
      } else {
        // Αλλιώς, προσθέτει την clean γραμμή
        resultGrid.push([...grid[j]]);
      }
    }

    const areArraysEqual = are2DArraysEqual(grid, resultGrid);

    if (areArraysEqual && i !== 0) {
      //console.log("Οι πίνακες είναι ίδιοι.");
      break;
    } else {
      grid = [...resultGrid];
    }

    if (sortedPhase.length <= 1) {
      //console.log("BLOCK IS SORTED ");
      break;
    }
  }

  // console.log(grid);

  return grid;
}

export { shearsort };
