<script lang="ts">
    import { notes } from "./logic";
    import { get } from "svelte/store";
    export let data;
    
    let note:NoteType|undefined;
    let nameInput="";
    let textInput="";
    
    import {onMount} from "svelte";
    onMount(()=>{
        const allNotes=get(notes);//Получаем все заметки из хранилища
        note=allNotes.find(n => n.id===data.id)
        if(note){
            nameInput=note.name;
            textInput=note.text;
        }
        if(!note){
            console.error("Заметка не найдена");

        }

        document.body.style.background="#FFF0F5";
    })
    
        
    interface NoteType{
        name:string
        text: string,
        id: string,
        data: string

    }
    
    function SaveNote(){
        //Сохраняем или обновляем заметку
        if(note){
            note.name=nameInput;
            note.text=textInput;
            //Обновляем заметки с новым значением
            notes.update(n =>{
                const updatedNotes=n.map(n => n.id===note?.id? note : n);
                localStorage.setItem("notes",JSON.stringify(updatedNotes));
                return updatedNotes;
                
            });
        }
        window.location.href=`/Homework3`;
    }
    
</script>
{#if note}
<ul class="data">{note.data}</ul>
<ul><input bind:value={nameInput} placeholder="Name"/></ul>
<ul><textarea bind:value={textInput} placeholder="Text" /></ul>
<button class="saveBtn" on:click={SaveNote}>Сохранить</button>
{:else}
   <p>Заметка не найдена</p>
{/if}
<style>
    .data{
        font-family:Brush Script MT, Brush Script Std, cursive;
        color:#FF00FF
    }
    input{
        border:0px;
        width:200px;
        height:30px;
        font-size:20px;background-color:#fcc8f5;
    }
    textarea{
        background-color:#fcc8f5;
        border: 0px;
        width:600px;
        height:500px
    }
    .saveBtn{
        background-color:#fcc8f5;
        border-radius:10cqmin;
        padding:10px;
        margin:30px;
        position:fixed;
        right:0;
        bottom:0;
        color:#FF00FF;
        border-color: white;
    }
</style>



