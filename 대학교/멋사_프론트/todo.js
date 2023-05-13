const todoInputElement = document.querySelector('.todo-input');
const todoEnterBtn = document.querySelector('.enter');
const todoList = document.querySelector('.todo-list');
const completeAllBtn = document.querySelector('.complete-all-btn');
const leftItem = document.querySelector('.left-items');
const showAll = document.querySelector('.show-all-btn');
const showActive = document.querySelector('.show-active-btn');
const showCompleted = document.querySelector('.show-completed-btn');
const clearAll = document.querySelector('.clear-all-btn');

//let -> const (배열,객체)
//모듈화 권장!
let todos = [];// todo를 모아놓은 객체 배열 {id, content, isCompleted}
let id = 1; // todo 객체의 id가 될 숫자

let isAllCompleted = false; // todos 속 모든 todo의 isCompleted가 true인지 저장하는 Boolean

let curType = 'all'; // 현재 필터값을 저장하는 string -> 'all', 'active', 'completed' 
// (선택)

// 현재 todos를 매개변수 newTodos로 바꿔주는 함수
const setTodos = (newTodos) => todos = newTodos; 

// 현재 todos 배열 전체를 반환하는 함수
// 감사 ><!!!
const getAllTodos = () => {
    //고정된 문자열 -> 상수로 표현하는게 더 좋은듯
    if(curType==='all') return todos;
    else if(curType==='active'){
        //아직 완료되지 않은일을 필터링 (false인 객체)
    return todos.filter(todos => !todos.isCompleted)
    }else{
        //완료된일 필터링
        return todos.filter(todos => todos.isCompleted)
    }
}
//모두
showAll.addEventListener('click', ()=>{
    curType='all'
    paintTodos();
})
//미완료한일
showActive.addEventListener('click', ()=>{
    curType='active'
    paintTodos();
})
//완료한일
showCompleted.addEventListener('click', ()=>{
    curType='completed'
    paintTodos();
})
//모두 지우기
clearAll.addEventListener('click',()=>{
    todos = [];
    paintTodos();
})

// 현재 input에 입력된 value를 가져와서 처리하는 함수 -> 키보드 enter, 버튼 클릭 2가지로 수행
const getInputValue = () => {
    // todoInputElement에 'enter'키가 "keypress"됐을 때, doTrimValue() 실행
    todoInputElement.addEventListener('keypress', (e) =>{
        if(e.key === 'Enter'){
            doTrimValue(e.target.value);
        }
    });
    // input 옆 enter 버튼을 'click'했을 때, doTrimValue() 실행
    todoEnterBtn.addEventListener('click', () =>{
        doTrimValue(todoInputElement.value);
    });
};

// 앞뒤 공백 제거 후, 빈 문자열이 아닐 경우 pushTodos() 실행
//length로 비교하는 게 더 좋을 듯 value가 0이 아니라면으로
const doTrimValue = (val) =>{ 
    const trimVal = String(val).trim(); // string으로 형 변환 후, 공백 제거
    if( trimVal !== ''){ // 빈 문자열이 아니면
        pushTodos(trimVal); // pushTodos()로 todos 배열에 추가하기
    }
    else{ // 빈 문자열이면
        alert("내용을 입력 후 클릭하세요"); // alert 창
    }
    todoInputElement.value = ""; // input의 value 없애기
};

getInputValue();

// todos 객체 배열에 객체 추가
const pushTodos = (context) =>{
    const newId = id++; // 아이디 할당
    const newTodos = [...todos, { id : newId, content : context, isCompleted : false }]; // 새로운 객체 배열 만들기, spread operator
    setTodos(newTodos); // setTodos()로 새로운 배열을 todos로 결정하기

    paintTodos(); // 갱신된 todos로 todo-list 작성하기
		// setLeftItems(); // 남은 할일 계산하기
}

// 현재 todos에 있는 객체로 todo-list 작성하기
const paintTodos = ()=>{
    // 지금까지 list에 있던 li 요소를 지운다
    todoList.innerHTML = null;

    const allTodos = getAllTodos();
    console.log(allTodos)
    allTodos.forEach(todo => paintFilterTodo(todo));
    setLeftItems(); 
};

const paintFilterTodo = (todo) =>{
    // 감싸줄 li 태그 생성, 클래스명 추가
    const liElement = document.createElement('li');
    liElement.classList.add('todo-item');
    // console.log(liElement);

//    // 현재 객체가 완료된 객체면 클래스로 checked 추가
//    if(todo.isCompleted){
//        liElement.classList.add('checked');
//    }

    // check button
    const checkElement = document.createElement('button');
    checkElement.innerHTML = "✔︎";

    //먼저 짜놓고 check 버튼 이벤트 리스너 구현
    //todo 객체의 isCompleted 속성이 참이면
    if (todo.isCompleted) {
        //checkbox속성 + completed속성
        checkElement.classList.add('checkbox','completed');
    } else {
        //checkbox속성만
        checkElement.classList.add('checkbox');
    }

    // content
    const contentElement = document.createElement('div');
    contentElement.innerHTML = todo.content;

    if (todo.isCompleted) {
        contentElement.classList.add('content', 'completed');
    } else {
        contentElement.classList.add('content');            
    }

    // check 버튼을 'click'했을 때 
    checkElement.addEventListener('click', () =>{
        //map()함수로 새로운 배열생성하고 todos배열에서 객체를 하나씩 순회

        //삼항 연산자!
        //todos = todos.map(originalTodo => originalTodo.id === todo.id ? originalTodo.isCompleted = !originalTodo.isCompleted : originalTodo
        
        todos = todos.map(originalTodo => {
            //todos 배열에서 원본 데이터를 변경하지 않고 
            //새로운 값을 가진 배열을 만들어 반환
            //현재 객체의 id값이 check 버튼의 id 값과 같은지 비교
            if (originalTodo.id === todo.id) 
            //일치하는 객체를 찾아 isCompleted 값을 반전
            originalTodo.isCompleted = !originalTodo.isCompleted;
            return originalTodo;
        })
        paintTodos()
    });
    

    // delete button
    const deleteElement = document.createElement('button');
    deleteElement.classList.add('delBtn');
    //innerHTML,innerText가 textcontent보다 느림.(사용권장)
    deleteElement.innerHTML = "✕";

    // delete 버튼을 'click'했을 때
    deleteElement.addEventListener('click', () =>{
        //콜백 함수 이용-삭제하고 싶은 객체의 id와 다른 나머지 함수들만 남김
        //원본 배열 변경하지 않음
        todos = todos.filter((originalTodo) => originalTodo.id !== todo.id)
        paintTodos()
    });
    
    // li 태그에 요소 합치기
    liElement.appendChild(checkElement);
    liElement.appendChild(contentElement);
    liElement.appendChild(deleteElement);

    // ul 태그에 현재 li 태그 합치기
    todoList.appendChild(liElement);
};

const setLeftItems = () => {
    const leftTodo = getAllTodos().filter(todo => todo.isCompleted == false);
    // console.log(leftTodo.length);
    leftItem.innerHTML = `🥕 오늘 할 일이 ${leftTodo.length}개 남아있습니다 🥕`;
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 시간을 표시할 형식 지정
    const format = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    // h1 요소의 텍스트 업데이트
    document.querySelector('.todo-title').textContent = format;
  }

  // 1초마다 시간을 업데이트
  setInterval(updateClock, 1000);






