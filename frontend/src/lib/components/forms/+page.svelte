<script lang="ts">
	import { superForm } from "sveltekit-superforms";
    const colors=['Красный','Чёрный','Белый','Синий'];
	export let data;
	const{form: newForm, message,enhance,errors}=superForm(data.form);
</script>
Создаём форму
<form method="POST" use:enhance>
    <label for="name">Name</label>
    
    <input type="text" name="name" bind:value={$newForm.name} />
    <label for="email">E-mail</label>
    <input type="email" name="email" bind:value={$newForm.email} />
    <label for="colors">Цвета</label>
    <select multiple name="colors" bind:value={$newForm.color}>
        {#each colors as colorOption}
        <option value={colorOption} selected={$newForm.color.includes(colorOption)}>{colorOption}</option>
        {/each}
    </select>
    <div><button>Submit</button></div>
    {#if $errors.name}
    <p>Ошибка в имени:{$errors.name}</p>
    {/if}
    {#if $errors.email}
    <p>Ошибка в email:{$errors.email}</p>
    {/if}
    {#if $message}
       <p>{$message}</p>
    {/if}
</form>

