<script lang="ts">
	import { page } from "$app/stores";
	let slug = $page.params.slug;
	import { notes } from "../components/notes/[id]/logic";
	import { createNote, DeleteNoteById } from "../components/notes/[id]/logic";
    import {onMount} from "svelte";
    onMount(()=>{
        
        document.body.style.background="#FFFFE0";
    })
    
	let search = "";
	interface NoteType {
		name: string;
		text: string;
		id: string;
		data: string;
	}
	function NewNote() {
		const newNote = createNote("", "");
		if (newNote && newNote.id) {
			//Перенаправление на страницу заметки с использованием id
			window.location.href = `/notes/${newNote.id}`;
		}
	}

	function DeleteNote(note: NoteType) {
		DeleteNoteById(note.id);
	}

	function OpenNote(note: NoteType) {
		window.location.href = `/notes/${note.id}`;
	}
</script>


<input class="SearchInput" placeholder="Поиск" bind:value={search} />

<button class="NewNote" on:click={() => NewNote()}> Новая заметка </button>

{#each $notes as note}
	{#if note.id !== undefined && note.id !== null}
		<div>
			{#if search.length == 0 || note.name.includes(search)}
            <div class="Note">
				<button class="Notes" on:click={() => OpenNote(note)}>
					{note.name}
				</button>
				<button class="deleteNote" on:click={() => DeleteNote(note)}><img width="20px" alt="delete" src="https://cdn-icons-png.flaticon.com/512/73/73806.png"></button>
            </div>
			{/if}
		</div>
	{/if}
{/each}
{#if $notes.length == 0}
	<ul><div class="Message">Здесь будут Ваши заметки</div></ul>
{/if}

<style>
    
    .deleteNote{
        border:0px;
        background-color:beige;
        margin-top: 40px;
        width:20px;
        height:30px;
        
    }
    .Notes{
        background-color:bisque;
        border-radius:10%;
        width:150px;
        height:80px;
        font-size:15px;
        padding:20px;
        margin:10px;
        border:0;
        margin-left:50px;
    }
	.Message {
		font-size: 20px;
		color: rgb(55, 225, 25);
		padding: 20px;
		height: 200px;
	}
	.SearchInput {
        margin-top: 10px;
        margin-left: 10px;;
        padding:0.5cm;
		border: 0px;
		text-align: start;
		font-size: 20px;
		height: 50px;
		width: 335px;
		border-radius: 10cqh;
	}
	.NewNote {
		background-color: rgb(32, 201, 40);
		border-radius: 10cqh;
		height: 60px;
		width: 140px;
		border: 3px solid red;
		border-color: rgb(40, 161, 38);
		font-family:
			Brush Script MT,
			Brush Script Std,
			cursive;
		font-size: 16px;
		margin: 10px;
		color: white;
		position: fixed;
		right: 0;
		top: 0;
	}
</style>
