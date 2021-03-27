function solvePuzzle(pieces) {
  const readyPieces = [];
  

//функция проверки переданного условия
function checkConditions(obj, keysValues) {
  if (!keysValues.length) return false;

  let result = keysValues
      .map(keyValue => {
        // console.log('obj ', obj);
        // console.log('key value ', equalObject(obj[`${keyValue[0]}`]), equalObject(keyValue[1]));
        // console.log('key = value', equalObject(obj[`${keyValue[0]}`]) === equalObject(keyValue[1]));
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

//функция поиска подxодящего к этой грани куска (и поворота найденного куска?????)
function findPiece(piecesArray, suitableEdge) {
  // function findPiece(piecesArray, suitableEdge, sideShouldBe) {
console.log('suitableEdge in findPiece = ', suitableEdge);

  return piecesArray.find(elem => {
    console.log('elem.edges = ', elem.edges);
    for (let edge in elem.edges) {

      const edgeObj = elem.edges[`${edge}`];
      if (edgeObj === null) {
// console.log('edgeObj null');
        continue;
      }

//       if (edgeObj.type === suitableEdge.type) {
// console.log('edgeObj', edgeObj);
// console.log('suitableEdge', suitableEdge);
//       }

      if (equalObject(edgeObj) === equalObject(suitableEdge)) {
        // console.log('edge должна стать левой', edge);
        // elem.edges = spinElement(elem.edges, {[`${sideShouldBe}`]: edgeObj});//какой должна стать найденная сторона - left, top, right, bottom

        return true;
      }
    }
  });
};

let suitableTopEdge = {};

  let currentElement = {};


    currentElement = {...pieces[0]};
    currentElement.edges = spinElement(currentElement.edges, {'left': null, 'top': null});


  
  readyPieces.push([currentElement.id]);
  pieces = pieces.filter(piece => piece.id !== currentElement.id);
console.log('первый элемент = ', currentElement);
console.log('pieces.length =', pieces.length);

  // if () {
    suitableTopEdge = {...currentElement.edges.bottom};//запоминаем положение нижней грани первого в линии элемента
    toggleIO(suitableTopEdge);
    console.log('suitableTopEdge = ', suitableTopEdge);
  // }

    let suitableLeftEdge = {...currentElement.edges.right};//следующий подходящий элемент
    
    for (let col=1; col<10; col++) {//заполняем первую строчку
      toggleIO(suitableLeftEdge);
// console.log('ищем suitableLeftEdge = ', suitableLeftEdge);

      const nextElement = {...findPiece(pieces, suitableLeftEdge)};

nextElement.edges = spinElement(nextElement.edges, {'left': suitableLeftEdge});

// console.log('будем искать грань для nextElement.rigth = ', nextElement.edges.right);// если это не последний элемент в линии
      
      readyPieces.push([nextElement.id]);
      pieces= pieces.filter(piece => piece.id !== nextElement.id);

      suitableLeftEdge = nextElement.edges.right;
    }

  
  return readyPieces;
}

// Не удаляйте эту строку
window.solvePuzzle = solvePuzzle;

