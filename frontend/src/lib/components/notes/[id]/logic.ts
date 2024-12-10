import { writable } from "svelte/store";
export const name1=writable("");
export const text1=writable("");
export const notes = writable<NoteType[]>([]);
interface NoteType{
    name:string
    text: string,
    id: string,
    data: string

}
const LOCAL_STORAGE_KEY="notes";
notes.set(loadNotesFromLocalStorage());
function saveNotesToLocalStorage(notes:NoteType[]){
    if(typeof window!=="undefined"){
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    }
}
export function loadNotesFromLocalStorage(): NoteType[]{
    if(typeof window!=="undefined"){
        const notesFromStorage=localStorage.getItem(LOCAL_STORAGE_KEY);
        return notesFromStorage ? JSON.parse(notesFromStorage):[];

    }
    return [];
}
export function createNote(name:string, text:string):NoteType{
    
    const id1=self.crypto.randomUUID();
    const data1=(new Date()).toISOString();
    const newNote={
        name: name,
        text: text,
        id: id1,
        data: data1
    };
    
    //Обновляем хранилище заметок
    notes.update(currentNotes =>{
        const updatedNotes=[...currentNotes,newNote];
        saveNotesToLocalStorage(updatedNotes);
        return updatedNotes;

    })
    //возвращаем созданную заметку
    return newNote;
}
export function DeleteNoteById(noteID:string){
    notes.update(currentNotes=>{
        const updatedNotes=currentNotes.filter(note=>note.id!=noteID);
        saveNotesToLocalStorage(updatedNotes);
        return updatedNotes;
    });

}
notes.set(loadNotesFromLocalStorage());
