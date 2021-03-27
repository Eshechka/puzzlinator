function solvePuzzle(pieces) {
  const readyPieces = [];
  
//функция проверки переданного условия
function checkConditions(obj, keysValues) {
  if (!keysValues.length) return false;

  let result = keysValues
      .map(keyValue => {
        return equalObject(obj[`${keyValue[0]}`]) === equalObject(keyValue[1]);
      })
      .reduce((total, current) => 
        total && current, 
        true
      );

  return result;
}

//функция поворота элемента (чтобы повернуть первый в линии элемент и узнать его корректные правый и нижний edge)
function spinElement(edges, conditionsObject) {
  let spinElem = Object.entries(edges);
  let maxSpinAmount = 1;

  while (!checkConditions(edges, Object.entries(conditionsObject))) {

    if (maxSpinAmount > 4) {
      throw Error('Неверные данные: невозможно так повернуть этот элемент');
    }
    spinElem = spinElem.map((elem,ndx) => {
      const key = spinElem[ndx+1] ? spinElem[ndx+1][0] : spinElem[0][0];
      const value = elem[1];
      return [`${key}`, value];
    });

    edges = Object.fromEntries(spinElem);
    maxSpinAmount++;
  }

  return edges;
}

//функция переключения типа грани с inside на outside
function toggleIO(edgeObject) {
  if (!edgeObject.type) {
    throw Error('Объект не содержит type для переключения');
  }
  switch(edgeObject.type) {
    case 'inside':  
      edgeObject.type = 'outside';
      break;
    case 'outside':  
      edgeObject.type = 'inside';
      break;
  }
};

//функция преобразования объекта для его сравнения с другим объектом
function equalObject(obj) {
  if (!obj) return obj;
  return JSON.stringify(Object.fromEntries(Object.entries(obj).sort()));
};

//функция поиска подxодящего к этой грани куска 
function findPiece(piecesArray, suitableEdge) {
  return piecesArray.find(elem => {
    for (let edge in elem.edges) {

      const edgeObj = elem.edges[`${edge}`];
      if (edgeObj === null) {
        continue;
      }
      if (equalObject(edgeObj) === equalObject(suitableEdge)) {
        return true;
      }
    }
  });
};

let suitableTopEdge = {};
for (let row = 1; row <= 10; row++) {
  let currentElement = {};
  if (row === 1) {
    currentElement = {...pieces[0]};
    currentElement.edges = spinElement(currentElement.edges, {'left': null, 'top': null});
  } else {
    currentElement = findPiece(pieces, suitableTopEdge);
    currentElement.edges = spinElement(currentElement.edges, {'top': suitableTopEdge});
  }
  
  readyPieces.push([currentElement.id]);
  pieces = pieces.filter(piece => piece.id !== currentElement.id);

  if (row<10) {
    suitableTopEdge = {...currentElement.edges.bottom};//запоминаем положение нижней грани первого в линии элемента
    toggleIO(suitableTopEdge);
  }

    let suitableLeftEdge = {...currentElement.edges.right};//следующий подходящий элемент
    
    for (let col=1; col<10; col++) {//заполняем строчку
      toggleIO(suitableLeftEdge);

      const nextElement = {...findPiece(pieces, suitableLeftEdge)};
      nextElement.edges = spinElement(nextElement.edges, {'left': suitableLeftEdge});

      readyPieces.push([nextElement.id]);
      pieces= pieces.filter(piece => piece.id !== nextElement.id);

      suitableLeftEdge = nextElement.edges.right;
    }

  }
  return readyPieces;
}

// Не удаляйте эту строку
window.solvePuzzle = solvePuzzle;

