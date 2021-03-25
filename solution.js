function solvePuzzle(pieces) {
  const readyPieces = [];
  const currentElement = pieces[0];

//функция проверки переданного условия
function checkConditions(obj, keysValues) {
  if (!keysValues.length) return false;

  let result = keysValues.map(keyValue => {
    return obj[`${keyValue[0]}`] === keyValue[1]
  }).reduce((total, current) => total && current, true);

  return result;
}

//функция поворота элемента (чтобы повернуть первый в линии элемент и узнать его корректные правый и нижний edge)
function spinFirstElementInLine(edges, conditionsObject) {
  let spinElem = Object.entries(edges);

  let maxSpinAmount = 1;
  while (!checkConditions(edges, Object.entries(conditionsObject))) {
    if (maxSpinAmount > 4) throw Error('Неверные данные: невозможно так повернуть этот элемент');
    spinElem = spinElem.map((elem,ndx) => {
      const key = spinElem[ndx+1] ? spinElem[ndx+1][0] : spinElem[0][0];
      const value = elem[1];
      return [`${key}`, value];
    });
    edges = Object.fromEntries(spinElem);
    maxSpinAmount++;
  }

  currentElement.edges = edges;
}

spinFirstElementInLine(currentElement.edges, {'left': null, 'top': null});


  
  console.log('currentElement.edges ', currentElement.edges);

  readyPieces.push([pieces[0].id]);//первый элемент

  // const suitableElement = {};

    

  // for (let ndx=1; ndx < pieces.length; ndx++) {
  //   suitableElement.edgeTypeId = 7;
  //   suitableElement.type = "outside";
    


  //   pieces.find(puzzleElem => {
  //     puzzleElem;
  //   })

  //   // JSON.stringify(Object.fromEntries(Object.entries(obj2).sort()))

  // }
  return readyPieces;
}

// Не удаляйте эту строку
window.solvePuzzle = solvePuzzle;

