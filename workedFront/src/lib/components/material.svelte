
<script>
    //localStorage.setItem("number",123);
    console.log(localStorage.getItem("number"));
    const user={
        name: "Alex",
        age:25
    };
    
    //Сохранение объекта в LocalStorage
    localStorage.setItem("user",JSON.stringify(user));
    //Извлечение объекта из localStorage
    //const retrievedUser=JSON.parse(localStorage.getItem("user"));
    //console.log(retrievedUser.name);//Alex
    //Проверяем установлена ли тема "dark" в LocalStorage
    if(localStorage.getItem("theme")==="dark"){
        //Если установлена тёмная тема, применяем её к body документа
        document.body.classList.add("dark-mode");
        console.log("dark")
    }
    else{console.log("shine")}
    //Пытаемся получить данные из localStorage по ключу "somedata"
    const cachedData = localStorage.getItem("somedata");
    //Проверяем существуют ли данные в кэше
    if(cachedData){
        //Если данные существуют, преобразуем их из строки в объект или масив и обрабатываем
        //processData(JSON.parse(cachedData));

    }
    
    //Работа без интернета
    //Пытаемся получить список задач из localStorage. Если его нет, используем пустой массив
    //const tasks=JSON.parse(localStorage.getItem("tasks")) || [];
    //Функция для добавления задачи
    //function addTask(task){
        //добавляем новую задачу в массив
        //tasks.push(task);
        //Сохраняем обновлённый список задач в localStorage
        //localStorage.setItem("tasks",JSON.stringify(tasks));
       
    
    //Как очистить LocalStorage
    localStorage.clear();
    //Если я хочу удалить конкретное значние из localStorage, надо использовать метод removeItem(), указав ключ, который хочу удалить
    //localStorage.removeItem("keyName"); 
    //Как создать уникальный id
    //let uuid = self.crypto.randomUUID();
    //console.log(uuid);
    //function id(){
        //const id1=self.crypto.randomUUID();
        //return id1;
        
    //}
    //const k=id();
    //console.log(k)
    //Используем ISO для создания даты
    //const event = new Date("05 October 2011 14:48 UTC");
    //console.log(event.toString());
    //console.log(event.toISOString());
    //const d = new Date(0);
    //console.log(d.toISOString());
    //const now = new Date("19 November 2024 12:14 UTC");
    //console.log(now.toISOString());
    //Автомотическое создание даты
    //const a=(new Date()).toISOString();
    //console.log(a)
    //Ссылка на страницу
    //let str = `/notes/${notes[0].id}`
    //`/notes/${notes[CountNotes].id}`
    //<button on:click={() => NewNote() }>
    //{#if notes[CountNotes].id!== underfined && notes[CountNotes].id!==null}
       //<a href=`/notes/${notes[CountNotes].id}`>Новая заметка</a>
    //{/if}
    //let id1= self.crypto.randomUUID();
    //let id1;
    //if (typeof self!=="undefined"){
       // id1=self.crypto.randomUUID();
   // }
    //else{
        //id1="default-id";
    //}
    
//</button>
//let data1=(new Date()).toISOString();
//onMount(() => {
    //const id1=self.crypto.randomUUID();
            //const data1=(new Date()).toISOString();

        //});
    //`/notes/${$notes[$CountNotes].id}`
    //{:else if search in note.name}
    //<button on:click={()=>OpenNote()}>
        //<a href={`/notes/${note.id}`}>{note.name}</a>
    //</button>
    //<button on:click={()=> DeleteNote(note)}>Удалить</button>
    //{:else}
    //Нет такой заметки
    //{/if}
    //const exactNote=JSON.parse(getNotes!).find(findNote(data.id));
    //function findNote(array:NoteType[],id:string){
        //array.map((element:NoteType)=>{
            //if(element.id==id){
               // return element
            //}

        //})
    //}
    //function getNote(){
        //if(window!==undefined){
            //const getNotes=localStorage.get("notes");
            //const exactNote=JSON.parse(getNotes!).find((element:NoteType)=>{
            //if(element.id==data.id){
                //return exactNote
            //}})
        //}
    //}
    //async function doFunc1(){
        //let promise=fetch("https://notes.clayenkitten.dev/user/login",{
        //method: "POST",
        //body: JSON.stringify({ login:"@nomatter714k" }),
        //headers:{
            //"Content-Type":"application/json"
        //}
        
    //});
    //let response=await promise;
    //let text2=await response.text();
    //text=text2;
    //}
    let amount = 1;
	interface GoodType {
		login: string;
		id: string;
		name: string;
		description: string;
		count: number;
		price: number;
		isUnic: boolean;
		category: string;
	}
	function plus(good: GoodType) {
		if (amount < good.count) {
			amount++;
		}
	}
	function minus(good: GoodType) {
		if (amount > 1) {
			amount--;
		}
	}
	const goods: GoodType[] = [
		{
			login: "Vadim_cvbnqq1",
			id: "4",
			name: "Блокнот для учёбы",
			description: "show everyone",
			count: 100,
			price: 10,
			isUnic: false,
			category: "stickers"
		},
		{
			login: "Vadim_cvbnqq1",
			id: "4",
			name: "cool stickers",
			description: "show everyone",
			count: 100,
			price: 10,
			isUnic: false,
			category: "stickers"
		},
		{
			login: "Vadim_cvbnqq1",
			id: "4",
			name: "cool stickers",
			description: "show everyone",
			count: 100,
			price: 10,
			isUnic: false,
			category: "stickers"
		}
	];
    import { goto } from "@sveltejs/kit";
    goto(`/AdminCatalog`);

//</script>



