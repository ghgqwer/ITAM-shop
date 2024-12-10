<script lang="ts">
    let token:string|null=null;
    let text="";
    
    function wait(sec:number){
        return new Promise(resolve=>{
            setTimeout(()=>{
                resolve("resolved");
            },sec*1000);
        })

    }
    
    async function login(){
        
        let promise=fetch("https://notes.clayenkitten.dev/user/login",{
        method: "POST",
        body: JSON.stringify({ login: "nomatter714" }),
        headers:{
            "Content-Type":"application/json"
        }
        
        
    });
    let response=await promise;
    let obj=await response.json();
    token=obj.token;
    
    }
    //Получение списка записок
    async function getList(){
        await wait(1)
        return [
            {header:"one", content:"the first"},
            {header:"two",content:"the second"},
            {header:"three", content:"the third"}
        ]
        //ПРАВИЛЬНЫЙ КОД
        if(!token){
           return;
        }
        let response=await fetch("https://notes.clayenkitten.dev/note",{
            headers: {
                "Content-Type":"application/json",
                "Authorization": token
            }
        });
        let obj=await response.json();
        console.log(obj);
    }
    

</script>
<button on:click={()=>login().catch(x=>console.log(x))}>Login</button>
{#await getList()}
    <p>Загрузка...</p>
{:then list}
    {#each list as note}
        <li>{note.header}</li>
    {/each}
{/await}